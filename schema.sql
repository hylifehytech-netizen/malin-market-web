-- Malin Market PostgreSQL Schema (Supabase Staging)
-- Tables: users, vendor_profiles, market_zones, stalls, bookings, feedbacks

-- 0. ลบตารางเดิมทิ้งทั้งหมด
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS stalls CASCADE;
DROP TABLE IF EXISTS market_zones CASCADE;
DROP TABLE IF EXISTS vendor_profiles CASCADE;
DROP TABLE IF EXISTS otp_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table (รองรับ Google Form Pre-approved & LINE Login)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    line_user_id TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    phone_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'approved', -- 'approved', 'pending', 'suspended'
    role VARCHAR(50) NOT NULL DEFAULT 'vendor', -- 'vendor', 'admin', 'executive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_line_user_id ON users(line_user_id);
CREATE INDEX idx_users_phone_number ON users(phone_number);

-- 3. Vendor Profiles (PDPA Encrypted Citizen ID)
CREATE TABLE vendor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    citizen_id_encrypted TEXT NOT NULL, -- AES-256-GCM Encrypted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Market Zones
CREATE TABLE market_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_code VARCHAR(50) UNIQUE NOT NULL, -- 'FOOD', 'FASHION', 'GIFTSHOP'
    zone_name VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) DEFAULT '#10B981',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Stalls
CREATE TABLE stalls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stall_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. A-01, B-05
    zone_id UUID REFERENCES market_zones(id),
    daily_price DECIMAL(10, 2) NOT NULL DEFAULT 250.00,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'MAINTENANCE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bookings
CREATE TABLE bookings (
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
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendor_profiles(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
