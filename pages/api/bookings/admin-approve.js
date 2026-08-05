import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { booking_id, status } = req.body; // status: 'APPROVED' or 'REJECTED'

  if (!booking_id || !['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' });
  }

  if (pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const bookingRes = await client.query(
        'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING stall_id',
        [status, booking_id]
      );

      if (bookingRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'ไม่พบรายการจอง' });
      }

      await client.query('COMMIT');
      return res.status(200).json({ success: true, message: `อัปเดตสถานะเป็น ${status} เรียบร้อยแล้ว` });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอนุมัติ' });
    } finally {
      client.release();
    }
  } else {
    const mockData = global.__mockDb;
    const booking = mockData.bookings.find(b => b.id === booking_id);

    if (!booking) {
      return res.status(404).json({ message: 'ไม่พบรายการจอง' });
    }

    booking.status = status;
    const targetStall = mockData.stalls.find(s => s.stall_number === booking.stall_number);
    if (targetStall) {
      targetStall.status = status === 'APPROVED' ? 'BOOKED' : 'AVAILABLE';
    }

    return res.status(200).json({ success: true, message: `อัปเดตสถานะเป็น ${status} เรียบร้อยแล้ว` });
  }
}
