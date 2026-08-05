import { Pool } from 'pg';

const connectionString = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;

let pool;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
} else {
  // In-memory mock storage for fallback demo when live DB connection string isn't provided
  global.__mockDb = global.__mockDb || {
    stalls: [
      { id: 's1', stall_number: 'A-01', zone: 'FOOD', price: 300, status: 'AVAILABLE' },
      { id: 's2', stall_number: 'A-02', zone: 'FOOD', price: 300, status: 'AVAILABLE' },
      { id: 's3', stall_number: 'A-03', zone: 'FOOD', price: 300, status: 'BOOKED' },
      { id: 's4', stall_number: 'B-01', zone: 'FASHION', price: 250, status: 'AVAILABLE' },
      { id: 's5', stall_number: 'B-02', zone: 'FASHION', price: 250, status: 'PENDING' },
      { id: 's6', stall_number: 'C-01', zone: 'GIFTSHOP', price: 200, status: 'MAINTENANCE' },
      { id: 's7', stall_number: 'C-02', zone: 'GIFTSHOP', price: 200, status: 'AVAILABLE' },
    ],
    bookings: [
      {
        id: 'b1',
        stall_number: 'A-03',
        vendor_name: 'สมชาย ขายของดี',
        phone: '081-234-5678',
        citizen_id_encrypted: 'mock_encrypted_1',
        booking_date: new Date().toISOString().split('T')[0],
        status: 'APPROVED',
        payment_type: 'PROMPTPAY',
        amount: 300,
        slip_url: 'https://placehold.co/300x400/D1FAE5/10B981?text=PromptPay+Slip'
      },
      {
        id: 'b2',
        stall_number: 'B-02',
        vendor_name: 'สมหญิง แฟชั่น',
        phone: '089-876-5432',
        citizen_id_encrypted: 'mock_encrypted_2',
        booking_date: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        payment_type: 'TRUEMONEY',
        amount: 250,
        slip_url: 'https://placehold.co/300x400/FEF3C7/D97706?text=TrueMoney+Slip'
      }
    ]
  };
}

export { pool };
