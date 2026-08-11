import { messagingApi } from '@line/bot-sdk';
import { supabaseAdmin } from '../../../src/lib/supabase';

const lineClient = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone || phone.length < 9) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' });
  }

  try {
    // 1. ค้นหา line_user_id จากตาราง users ใน Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('line_user_id, name')
      .eq('phone', phone)
      .single();

    const lineOaId = process.env.LINE_OA_ID || '@769kvfhj';
    const lineOaUrl = `https://line.me/R/ti/p/${encodeURIComponent(lineOaId)}`;

    // ถ้ายังไม่มี User หรือยังไม่มี line_user_id ผูกไว้
    if (userError || !user || !user.line_user_id) {
      return res.status(200).json({
        success: true,
        need_add_line: true,
        message: 'กรุณาแอดไลน์และส่งเบอร์โทรศัพท์ในแชทเพื่อเชื่อมต่อบัญชี',
        line_oa_url: lineOaUrl,
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(lineOaUrl)}`
      });
    }

    // 2. สุ่มรหัส OTP 6 หลัก และตั้งวันหมดอายุ (5 นาที)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 3. บันทึก OTP ลง Supabase ตาราง otp_requests
    const { error: otpInsertError } = await supabaseAdmin
      .from('otp_requests')
      .insert([{ phone, otp_code: otpCode, expires_at: expiresAt }]);

    if (otpInsertError) {
      throw new Error(`DB Insert Error: ${otpInsertError.message}`);
    }

    // 4. ยิงข้อความ OTP เข้า LINE OA ผ่าน Messaging API
    await lineClient.pushMessage({
      to: user.line_user_id,
      messages: [
        {
          type: 'text',
          text: `[กาดมาลินหน้า มช.] 🛍️\nรหัส OTP สำหรับเข้าสู่ระบบของคุณคือ: ${otpCode}\n(รหัสมีอายุ 5 นาที โปรดอย่าเปิดเผยรหัสนี้แก่ผู้อื่น)`,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      need_add_line: false,
      message: 'ส่งรหัส OTP เข้า LINE เรียบร้อยแล้ว'
    });

  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการส่ง OTP' });
  }
}
