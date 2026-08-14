import { supabaseAdmin } from '../../../src/lib/supabase';
import { encryptID } from '../../../lib/crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { line_user_id, full_name, phone, citizen_id, store_name } = req.body;

  if (!line_user_id || !full_name || !phone || !citizen_id) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    // 1. ค้นหา User ID ในตาราง users
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('line_user_id', line_user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: 'ไม่พบบัญชีผู้ใช้งาน LINE นี้' });
    }

    // 2. เข้ารหัส Citizen ID ตามมาตรฐาน PDPA
    const encryptedCitizen = encryptID(citizen_id);

    // 3. Upsert ข้อมูลลงตาราง vendor_profiles
    const { error: profileError } = await supabaseAdmin
      .from('vendor_profiles')
      .upsert(
        {
          user_id: user.id,
          full_name,
          phone_number: phone,
          citizen_id_encrypted: encryptedCitizen,
        },
        { onConflict: 'user_id' }
      );

    if (profileError) {
      console.error('Profile DB error:', profileError);
      throw profileError;
    }

    // 4. อัปเดต Display Name ในตาราง users
    await supabaseAdmin
      .from('users')
      .update({ display_name: full_name })
      .eq('id', user.id);

    return res.status(200).json({
      success: true,
      message: 'ลงทะเบียนข้อมูลผู้ค้าสำเร็จ',
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
}
