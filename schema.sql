-- Malin Market PostgreSQL Schema (Supabase Staging)
-- Tables: users, vendor_profiles, market_zones, stalls, bookings, feedbacks

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'vendor', -- 'vendor', 'admin', 'executive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vendor Profiles (PDPA Encrypted Citizen ID)
CREATE TABLE IF NOT EXISTS vendor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    citizen_id_encrypted TEXT NOT NULL, -- AES-256-GCM Encrypted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Market Zones
CREATE TABLE IF NOT EXISTS market_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_code VARCHAR(50) UNIQUE NOT NULL, -- 'FOOD', 'FASHION', 'GIFTSHOP'
    zone_name VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) DEFAULT '#10B981',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Stalls
CREATE TABLE IF NOT EXISTS stalls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stall_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. A-01, B-05
    zone_id UUID REFERENCES market_zones(id),
    daily_price DECIMAL(10, 2) NOT NULL DEFAULT 250.00,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'MAINTENANCE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stall_id UUID REFERENCES stalls(id),
    vendor_id UUID REFERENCES vendor_profiles(id),
    booking_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
    payment_slip_url TEXT,
    payment_type VARCHAR(50), -- 'PROMPTPAY', 'TRUEMONEY'
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_stall_date UNIQUE (stall_id, booking_date)
);

-- 7. Feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow public reads for market_zones, stalls, bookings for stall map display
CREATE POLICY "Public read market_zones" ON market_zones FOR SELECT USING (true);
CREATE POLICY "Public read stalls" ON stalls FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);

-- Vendor access policies
CREATE POLICY "Users view own profile" ON vendor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON vendor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own bookings" ON bookings FOR SELECT USING (auth.uid() = (SELECT user_id FROM vendor_profiles WHERE id = bookings.vendor_id));
