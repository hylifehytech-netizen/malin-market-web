import { pool } from '../../../lib/db';
import { encryptID } from '../../../lib/crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { stall_number, vendor_name, phone_number, citizen_id, booking_date, payment_type, payment_slip_url } = req.body;

  if (!stall_number || !vendor_name || !citizen_id || !booking_date) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลการจองให้ครบถ้วน' });
  }

  // Encrypt Citizen ID for PDPA compliance
  const encryptedCitizenID = encryptID(citizen_id);

  if (pool) {
    // Real PostgreSQL Connection with Transaction & Pessimistic Locking
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Pessimistic Lock on Stall record
      const stallRes = await client.query(
        'SELECT id, daily_price, status FROM stalls WHERE stall_number = $1 FOR UPDATE',
        [stall_number]
      );

      if (stallRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'ไม่พบหมายเลขล็อกที่ระบุ' });
      }

      const stall = stallRes.rows[0];

      if (stall.status === 'MAINTENANCE') {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'ล็อกนี้อยู่ในระหว่างปิดปรับปรุง' });
      }

      // 2. Check existing bookings with FOR UPDATE
      const existingBooking = await client.query(
        `SELECT id FROM bookings 
         WHERE stall_id = $1 AND booking_date = $2 AND status IN ('PENDING', 'APPROVED') 
         FOR UPDATE`,
        [stall.id, booking_date]
      );

      if (existingBooking.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ message: 'ล็อกนี้ถูกจองไปแล้ว กรุณาเลือกล็อกอื่น' });
      }

      // 3. Insert or update vendor profile
      const vendorRes = await client.query(
        `INSERT INTO vendor_profiles (full_name, phone_number, citizen_id_encrypted)
         VALUES ($1, $2, $3) RETURNING id`,
        [vendor_name, phone_number, encryptedCitizenID]
      );
      const vendorId = vendorRes.rows[0].id;

      // 4. Create Booking
      const bookingRes = await client.query(
        `INSERT INTO bookings (stall_id, vendor_id, booking_date, status, payment_type, payment_slip_url, amount)
         VALUES ($1, $2, $3, 'PENDING', $4, $5, $6) RETURNING id`,
        [stall.id, vendorId, booking_date, payment_type || 'PROMPTPAY', payment_slip_url || '', stall.daily_price]
      );

      await client.query('COMMIT');

      return res.status(201).json({
        success: true,
        message: 'ส่งคำขอจองล็อกสำเร็จ รอ Admin ตรวจสอบ',
        booking_id: bookingRes.rows[0].id
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Booking transaction error:', error);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบจองล็อก' });
    } finally {
      client.release();
    }
  } else {
    // Mock Store Flow (Fallback demo when DB URL is not connected)
    const mockData = global.__mockDb;
    const targetStall = mockData.stalls.find(s => s.stall_number === stall_number);

    if (!targetStall) {
      return res.status(404).json({ message: 'ไม่พบหมายเลขล็อกที่ระบุ' });
    }

    if (targetStall.status === 'MAINTENANCE') {
      return res.status(400).json({ message: 'ล็อกนี้อยู่ในระหว่างปิดปรับปรุง' });
    }

    const isAlreadyBooked = mockData.bookings.some(
      b => b.stall_number === stall_number && b.booking_date === booking_date && b.status !== 'REJECTED'
    );

    if (isAlreadyBooked) {
      return res.status(409).json({ message: 'ล็อกนี้ถูกจองไปแล้ว กรุณาเลือกล็อกอื่น' });
    }

    const newBooking = {
      id: 'b_' + Date.now(),
      stall_number,
      vendor_name,
      phone: phone_number,
      citizen_id_encrypted: encryptedCitizenID,
      booking_date,
      status: 'PENDING',
      payment_type: payment_type || 'PROMPTPAY',
      amount: targetStall.price,
      slip_url: payment_slip_url || 'https://placehold.co/300x400/FEF3C7/D97706?text=Uploaded+Slip'
    };

    mockData.bookings.push(newBooking);
    targetStall.status = 'PENDING';

    return res.status(201).json({
      success: true,
      message: 'ส่งคำขอจองล็อกสำเร็จ รอ Admin ตรวจสอบ (Mock Environment)',
      booking_id: newBooking.id
    });
  }
}
