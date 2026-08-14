import { supabaseAdmin } from '../../../src/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, users: users || [] });
    } catch (error) {
      console.error('Fetch users error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  if (req.method === 'POST') {
    const { phone_number, display_name, status } = req.body;

    if (!phone_number) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกเบอร์โทรศัพท์' });
    }

    const cleanPhone = phone_number.replace(/[-\s]/g, '');

    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .upsert(
          {
            phone_number: cleanPhone,
            display_name: display_name || 'ผู้ค้าที่ลงทะเบียน',
            status: status || 'approved',
            role: 'vendor',
          },
          { onConflict: 'phone_number' }
        )
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ success: true, message: 'เพิ่ม/อัปเดตข้อมูลผู้ค้าสำเร็จ', user: data });
    } catch (error) {
      console.error('Insert user error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      const { error } = await supabaseAdmin.from('users').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'ลบผู้ใช้สำเร็จ' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
