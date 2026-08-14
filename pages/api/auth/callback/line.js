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

    // 2. ใช้ Access Token ดึง Profile ของ User จาก LINE
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LINE profile');
    }

    // 3. Upsert ข้อมูลลงตาราง users ใน Supabase
    const { data: user, error: dbError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          line_user_id: profile.userId,
          display_name: profile.displayName,
          avatar_url: profile.pictureUrl,
          role: 'vendor',
        },
        { onConflict: 'line_user_id' }
      )
      .select()
      .single();

    if (dbError) throw dbError;

    // 4. Login สำเร็จ Redirect กลับไปหน้าแรกพร้อม User Context
    const userParam = encodeURIComponent(JSON.stringify({
      id: user.id,
      line_user_id: user.line_user_id,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      role: user.role
    }));
    
    res.redirect(`/?login=success&user=${userParam}`);
  } catch (error) {
    console.error('LINE Login Error:', error);
    res.redirect(`/?login=error&message=${encodeURIComponent(error.message)}`);
  }
}
