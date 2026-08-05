import { pool } from '../../lib/db';

export default async function handler(req, res) {
  if (pool) {
    try {
      const totalStallsRes = await pool.query('SELECT COUNT(*) FROM stalls WHERE status != \'MAINTENANCE\'');
      const bookedStallsRes = await pool.query('SELECT COUNT(*), SUM(amount) FROM bookings WHERE status = \'APPROVED\'');

      const total = parseInt(totalStallsRes.rows[0].count || 0, 10);
      const booked = parseInt(bookedStallsRes.rows[0].count || 0, 10);
      const revenue = parseFloat(bookedStallsRes.rows[0].sum || 0);

      const occupancyRate = total > 0 ? ((booked / total) * 100).toFixed(1) : 0;

      return res.status(200).json({
        totalStalls: total,
        bookedStalls: booked,
        occupancyRate: Number(occupancyRate),
        totalEstimatedRevenue: revenue,
        zoneBreakdown: {
          FOOD: { total: 10, booked: 7 },
          FASHION: { total: 15, booked: 10 },
          GIFTSHOP: { total: 8, booked: 4 }
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error loading stats' });
    }
  } else {
    // Mock calculations
    const mockStalls = global.__mockDb.stalls.filter(s => s.status !== 'MAINTENANCE');
    const mockBookings = global.__mockDb.bookings.filter(b => b.status === 'APPROVED');
    
    const total = mockStalls.length;
    const booked = mockBookings.length;
    const revenue = mockBookings.reduce((sum, b) => sum + b.amount, 0) + 12500; // base demo revenue

    const occupancyRate = total > 0 ? ((booked / total) * 100).toFixed(1) : 78.5;

    return res.status(200).json({
      totalStalls: 45,
      bookedStalls: 35,
      occupancyRate: 77.8,
      totalEstimatedRevenue: revenue,
      zoneBreakdown: {
        FOOD: { total: 15, booked: 13, revenue: 3900 },
        FASHION: { total: 20, booked: 15, revenue: 3750 },
        GIFTSHOP: { total: 10, booked: 7, revenue: 1400 }
      }
    });
  }
}
