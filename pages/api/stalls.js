import { pool } from '../../lib/db';

export default async function handler(req, res) {
  const { date, zone } = req.query;

  if (pool) {
    try {
      const stallsRes = await pool.query(
        `SELECT s.id, s.stall_number, s.daily_price as price, s.status, z.zone_code as zone
         FROM stalls s
         LEFT JOIN market_zones z ON s.zone_id = z.id`
      );
      
      const bookingsRes = await pool.query(
        `SELECT b.id, b.booking_date, b.status, s.stall_number
         FROM bookings b
         JOIN stalls s ON b.stall_id = s.id
         WHERE b.booking_date = $1`,
        [date || new Date().toISOString().split('T')[0]]
      );

      const bookingsMap = {};
      bookingsRes.rows.forEach(b => {
        bookingsMap[b.stall_number] = b.status;
      });

      const stalls = stallsRes.rows.map(s => {
        let calculatedStatus = s.status;
        if (s.status !== 'MAINTENANCE' && bookingsMap[s.stall_number]) {
          calculatedStatus = bookingsMap[s.stall_number] === 'APPROVED' ? 'BOOKED' : 'PENDING';
        }
        return {
          ...s,
          status: calculatedStatus
        };
      });

      const filteredStalls = zone && zone !== 'ALL' ? stalls.filter(s => s.zone === zone) : stalls;

      return res.status(200).json({ stalls: filteredStalls });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error loading stalls' });
    }
  } else {
    // Mock Data return
    let stalls = global.__mockDb.stalls;
    if (zone && zone !== 'ALL') {
      stalls = stalls.filter(s => s.zone === zone);
    }
    return res.status(200).json({ stalls, bookings: global.__mockDb.bookings });
  }
}
