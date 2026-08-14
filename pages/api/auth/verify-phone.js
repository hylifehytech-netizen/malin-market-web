import { supabaseAdmin } from '../../../src/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { line_user_id, display_name, avatar_url, phone } = req.body;

  if (!line_user_id || !phone) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกเบอร์โทรศัพท์' });
  }

  // แปลงเบอร์โทรให้เป็นตัวเลขล้วน (ตัด - และ space ออก)
  const cleanPhone = phone.replace(/[-\s]/g, '');

  try {
    // 1. ค้นหาเบอร์โทรศัพท์นี้ในตาราง users ที่แอดมิน Import มาล่วงหน้า
    const { data: user, error: findError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('phone_number', cleanPhone)
      .maybeSingle();

    if (findError) {
      throw findError;
    }

    // ❌ กรณีที่ 1: ไม่พบเบอร์โทรในระบบ
    if (!user) {
      return res.status(404).json({
        success: false,
        not_found: true,
        message: '❌ ไม่พบข้อมูลการลงทะเบียนเบอร์นี้ในระบบ กรุณากรอกแบบฟอร์มลงทะเบียน หรือแอด LINE OA ติดต่อเจ้าหน้าที่'
      });
    }

    // ❌ กรณีที่ 2: พบเบอร์ แต่สถานะยังไม่ approved
    if (user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: '⚠️ ข้อมูลของคุณยังไม่ได้รับการอนุมัติ กรุณาติดต่อแอดมินผ่าน LINE OA'
      });
    }

    // ❌ กรณีที่ 3: เบอร์นี้เคยผูกกับ LINE อื่นไปแล้ว
    if (user.line_user_id && user.line_user_id !== line_user_id) {
      return res.status(409).json({
        success: false,
        message: '⚠️ เบอร์โทรนี้ถูกผูกกับบัญชี LINE อื่นแล้ว หากต้องการเปลี่ยนบัญชีโปรดติดต่อเจ้าหน้าที่'
      });
    }

    // ✅ กรณีที่ 4: เจอเบอร์ + approved -> อัปเดตผูก line_user_id ทันที
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        line_user_id,
        display_name: display_name || user.display_name,
        avatar_url: avatar_url || user.avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      message: '✅ ผูกบัญชี LINE และยืนยันตัวตนสำเร็จ!',
      user: {
        id: updatedUser.id,
        username: updatedUser.display_name || cleanPhone,
        phone_number: cleanPhone,
        role: updatedUser.role || 'vendor',
        avatar: updatedUser.avatar_url,
        line_user_id: updatedUser.line_user_id
      }
    });

  } catch (error) {
    console.error('Verify phone error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล' });
  }
}
