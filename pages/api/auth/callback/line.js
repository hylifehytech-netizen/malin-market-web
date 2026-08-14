import { supabaseAdmin } from '../../../../src/lib/supabase';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // ตรวจจับ URL อัตโนมัติ (ไม่ว่ารันบน Vercel หรือ Local)
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;
    const redirectUri = `${baseUrl}/api/auth/callback/line`;

    // 1. แลก Code เป็น Access Token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINE_LOGIN_CHANNEL_ID,
        client_secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to fetch token');
    }

    // 2. ดึง Profile จาก LINE
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileResponse.json();
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LINE profile');
    }

    // 3. 🔍 ค้นหาในตาราง users ว่ามี line_user_id นี้ผูกไว้แล้วหรือยัง
    const { data: existingUser, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('line_user_id', profile.userId)
      .maybeSingle();

    if (dbError) {
      console.error('Supabase Query Error:', dbError);
      throw dbError;
    }

    // 4. เงื่อนไขแยกหน้า
    if (existingUser && existingUser.status === 'approved') {
      // ✅ กรณี 1: ผูก LINE ไว้แล้ว และได้รับอนุมัติ -> อัปเดตรูป/ชื่อล่าสุด แล้วพาเข้าหน้าหลัก
      await supabaseAdmin
        .from('users')
        .update({
          display_name: profile.displayName || existingUser.display_name,
          avatar_url: profile.pictureUrl || existingUser.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id);

      const userParam = encodeURIComponent(JSON.stringify({
        id: existingUser.id,
        line_user_id: existingUser.line_user_id,
        display_name: profile.displayName || existingUser.display_name,
        avatar_url: profile.pictureUrl || existingUser.avatar_url,
        phone_number: existingUser.phone_number,
        role: existingUser.role || 'vendor'
      }));

      return res.redirect(`/?login=success&user=${userParam}`);
    } else {
      // ⚠️ กรณี 2: ยังไม่เคยผูก LINE -> เด้งไปหน้า /register เพื่อกรอกเบอร์โทรที่เคยให้ไว้ใน Google Form
      const params = new URLSearchParams({
        line_user_id: profile.userId,
        display_name: profile.displayName || '',
        avatar_url: profile.pictureUrl || '',
      });
      return res.redirect(`/register?${params.toString()}`);
    }
  } catch (error) {
    console.error('LINE Login Callback Error:', error);
    return res.redirect(`/?login=error&message=${encodeURIComponent(error.message)}`);
  }
}
