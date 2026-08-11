import { messagingApi } from '@line/bot-sdk';
import { supabaseAdmin } from '../../../src/lib/supabase';

const lineClient = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export const config = {
  api: {
    bodyParser: true, // LINE SDK parsed body
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const events = req.body.events || [];

  for (const event of events) {
    // ดักจับเฉพาะ Message Event ที่เป็น ข้อความตัวอักษร
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text.trim();
      const lineUserId = event.source.userId;

      // ตรวจหาแพทเทิร์นเบอร์โทรไทย (เช่น 0812345678 หรือ 081-234-5678)
      const phoneRegex = /^0[689]\d{8}$|^0[689]\d{1}-\d{4}-\d{4}$/;
      const cleanPhone = userMessage.replace(/-/g, '');

      if (phoneRegex.test(cleanPhone)) {
        try {
          // 1. Upsert ข้อมูล line_user_id ผูกกับเบอร์โทรศัพท์ใน Supabase
          const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from('users')
            .upsert(
              { phone: cleanPhone, line_user_id: lineUserId, name: 'พ่อค้าแม่ค้า กาดมาลิน' },
              { onConflict: 'phone' }
            )
            .select()
            .single();

          if (!updateError) {
            // 2. สุ่ม OTP และบันทึกลง DB
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            await supabaseAdmin
              .from('otp_requests')
              .insert([{ phone: cleanPhone, otp_code: otpCode, expires_at: expiresAt }]);

            // 3. ตอบกลับแชท LINE OA ยืนยันผูกเบอร์ + แจ้ง OTP
            await lineClient.replyMessage({
              replyToken: event.replyToken,
              messages: [
                {
                  type: 'text',
                  text: `✅ เชื่อมต่อเบอร์โทร ${cleanPhone} สำเร็จ!\n\n🔑 รหัส OTP สำหรับกรอกบนหน้าเว็บคือ: ${otpCode}`,
                },
              ],
            });
          }
        } catch (err) {
          console.error('Webhook Error:', err);
        }
      }
    }
  }

  return res.status(200).json({ status: 'ok' });
}
