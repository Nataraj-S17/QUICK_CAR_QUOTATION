-- ==========================================================
-- 🚗 Quick Quotation Using AI - Database Schema Design
-- ==========================================================
-- This script sets up the core tables for the application.
-- Run this script in your PostgreSQL database tool (e.g., pgAdmin, DBeaver)
-- or via command line: psql -U postgres -d car_quotation_db -f DATABASE_SCHEMA.sql

-- ----------------------------------------------------------
-- 1️⃣ CLEANUP (Optional - Use with Caution)
-- ----------------------------------------------------------
-- DROP TABLE IF EXISTS quotations CASCADE;
-- DROP TABLE IF EXISTS customer_requirements CASCADE;
-- DROP TABLE IF EXISTS cars CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;
-- DROP TABLE IF EXISTS admin CASCADE;

-- ----------------------------------------------------------
-- 2️⃣ ADMIN TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------
-- 3️⃣ CUSTOMERS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------
-- 4️⃣ CARS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    fuel_type VARCHAR(50) NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG')),
    mileage INTEGER NOT NULL, -- in km
    base_price DECIMAL(12, 2) NOT NULL,
    condition VARCHAR(50) NOT NULL CHECK (condition IN ('New', 'Used', 'Refurbished')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------
-- 5️⃣ CUSTOMER REQUIREMENTS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS customer_requirements (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    budget DECIMAL(12, 2) NOT NULL,
    usage_type VARCHAR(100), -- e.g., 'City Commute', 'Highway Travel', 'Off-road'
    mileage_priority VARCHAR(50) CHECK (mileage_priority IN ('Low', 'Medium', 'High')),
    maintenance_priority VARCHAR(50) CHECK (maintenance_priority IN ('Low', 'Medium', 'High')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------
-- 6️⃣ QUOTATIONS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    requirement_id INTEGER NOT NULL REFERENCES customer_requirements(id),
    ai_score DECIMAL(5, 2), -- Score from 0.00 to 10.00
    final_price DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 📝 SAMPLE DATA INSERTION
-- ==========================================================

-- 1. Insert Admin
-- Password: 'admin123' (hashed)
INSERT INTO admin (email, password)
VALUES ('admin@system.com', '$2b$10$YourHashedPasswordHereOrUseBcryptLater')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Customer
-- Password: 'customer123' (hashed)
INSERT INTO customers (name, phone, email, password)
VALUES ('Rahul Sharma', '9876543210', 'rahul@example.com', '$2b$10$YourHashedPasswordHereOrUseBcryptLater')
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Car
INSERT INTO cars (brand, model, year, fuel_type, mileage, base_price, condition)
VALUES ('Toyota', 'Innova Crysta', 2022, 'Diesel', 45000, 1850000.00, 'Used');

-- 4. Insert Customer Requirement
INSERT INTO customer_requirements (customer_id, budget, usage_type, mileage_priority, maintenance_priority)
VALUES (
    (SELECT id FROM customers WHERE email='rahul@example.com' LIMIT 1),
    2000000.00,
    'Highway Travel',
    'High',
    'Low'
);

-- 5. Insert Quotation
INSERT INTO quotations (customer_id, car_id, requirement_id, ai_score, final_price, status)
VALUES (
    (SELECT id FROM customers WHERE email='rahul@example.com' LIMIT 1),
    (SELECT id FROM cars WHERE brand='Toyota' AND model='Innova Crysta' LIMIT 1),
    (SELECT id FROM customer_requirements WHERE customer_id=(SELECT id FROM customers WHERE email='rahul@example.com' LIMIT 1) LIMIT 1),
    8.5,
    1825000.00,
    'pending'
);

-- ==========================================================
-- ✅ VERIFICATION QUERIES
-- ==========================================================
/*
-- Check Customers
SELECT * FROM customers;

-- Check Cars
SELECT * FROM cars;

-- Verify Quotation Relations
SELECT 
    q.id as quotation_id,
    c.name as customer_name,
    car.brand || ' ' || car.model as car_details,
    req.budget,
    q.final_price,
    q.status
FROM quotations q
JOIN customers c ON q.customer_id = c.id
JOIN cars car ON q.car_id = car.id
JOIN customer_requirements req ON q.requirement_id = req.id;
*/
