import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://staging-malin-market.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'staging-service-role-key-placeholder'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { phone, otp_code } = req.body;

  if (!phone || !otp_code) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกเบอร์โทรศัพท์และรหัส OTP' });
  }

  try {
    // 1. ค้นหา OTP ที่ล่าสุด ยังไม่ถูกใช้งาน และตรงกับเบอร์โทรศัพท์
    const { data: otpRecord, error: otpError } = await supabase
      .from('otp_requests')
      .select('*')
      .eq('phone', phone)
      .eq('otp_code', otp_code)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      return res.status(400).json({ success: false, message: 'รหัส OTP ไม่ถูกต้องหรือถูกใช้งานไปแล้ว' });
    }

    // 2. ตรวจสอบอายุของ OTP (Expiration Check)
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);

    if (now > expiresAt) {
      return res.status(400).json({ success: false, message: 'รหัส OTP หมดอายุแล้ว กรุณากรอกขอรหัสใหม่' });
    }

    // 3. อัปเดตสถานะ OTP ให้เป็นใช้งานแล้ว (Flag as used)
    await supabase
      .from('otp_requests')
      .update({ is_used: true })
      .eq('request_id', otpRecord.request_id); // The schema has request_id as primary key

    // 4. อัปเดตสถานะผู้ใช้งานเป็น ยืนยันแล้ว (is_verified = true)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({ is_verified: true, updated_at: new Date() })
      .eq('phone', phone)
      .select('user_id, name, phone, role, is_verified') // The schema has user_id, not id
      .single();

    if (userError || !userData) {
      return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้งาน' });
    }

    // 5. ส่งผลลัพธ์และข้อมูล Profile กลับไปที่ Frontend (สามารถผูก JWT หรือ Cookie เพิ่มเติมได้ที่นี่)
    return res.status(200).json({
      success: true,
      message: 'ยืนยันตัวตนสำเร็จ',
      user: userData,
    });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
}
