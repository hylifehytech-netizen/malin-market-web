import { supabaseAdmin } from '../../../../src/lib/supabase';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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

    // 3. 🔍 ตรวจสอบในตาราง users ว่ามี line_user_id นี้แล้วหรือยัง
    const { data: existingUser, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('line_user_id', profile.userId)
      .maybeSingle();

    if (dbError) {
      console.error('Supabase Query Error:', dbError);
      throw dbError;
    }

    // 4. เงื่อนไขแยกหน้า (Redirect)
    if (existingUser && (existingUser.phone_number || existingUser.phone)) {
      // ✅ กรณี 1: มีบัญชีแล้ว + มีเบอร์โทรแล้ว -> เด้งไปหน้าแรก / Dashboard
      const userParam = encodeURIComponent(JSON.stringify({
        id: existingUser.id,
        line_user_id: existingUser.line_user_id,
        display_name: existingUser.display_name || profile.displayName,
        avatar_url: existingUser.avatar_url || profile.pictureUrl,
        phone_number: existingUser.phone_number || existingUser.phone,
        role: existingUser.role || 'vendor'
      }));
      return res.redirect(`/?login=success&user=${userParam}`);
    } else {
      // ⚠️ กรณี 2: ยังไม่ได้สมัคร (หรือยังไม่ได้ใส่เบอร์โทร) -> เด้งไปหน้าสมัครสมาชิก พร้อมส่งข้อมูล LINE ไปด้วย
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
