export default function handler(req, res) {
  const clientId = process.env.LINE_LOGIN_CHANNEL_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/callback/line`);
  const state = Math.random().toString(36).substring(7); // ป้องกัน CSRF
  const scope = 'profile openid';

  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

  res.redirect(lineAuthUrl);
}
