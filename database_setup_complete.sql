-- ============================================
-- COMPLETE DATABASE SETUP FOR NETSALES APP
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This will create all necessary tables and policies

-- 1. AREAS (Regions)
CREATE TABLE IF NOT EXISTS areas (
  id bigint primary key generated always as identity,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SUB_AREAS (Cities)
CREATE TABLE IF NOT EXISTS sub_areas (
  id bigint primary key generated always as identity,
  area_id bigint references areas(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. DISTRICTS (Kecamatan)
CREATE TABLE IF NOT EXISTS districts (
  id bigint primary key generated always as identity,
  sub_area_id bigint references sub_areas(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id bigint primary key generated always as identity,
  name text not null,
  price numeric default 0 not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PROMOS
CREATE TABLE IF NOT EXISTS promos (
  id bigint primary key generated always as identity,
  name text not null,
  discount_percent numeric default 0,
  valid_from date,
  valid_until date,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SALES_TEAM
CREATE TABLE IF NOT EXISTS sales_team (
  id bigint primary key generated always as identity,
  name text not null,
  sub_area_id bigint references sub_areas(id) on delete set null,
  nip text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. TARGETS
CREATE TABLE IF NOT EXISTS targets (
  id bigint primary key generated always as identity,
  entity_type text not null, -- 'area' or 'sub_area'
  entity_id bigint not null,
  target_value numeric default 0 not null,
  availability_value numeric default 0,
  year integer not null,
  period_type text default 'yearly',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(entity_type, entity_id, year)
);

-- 8. PROSPECTS
CREATE TABLE IF NOT EXISTS prospects (
  id bigint primary key generated always as identity,
  name text not null,
  nik text,
  address text,
  latitude double precision,
  longitude double precision,
  
  -- Foreign Keys to Master Data
  area_id bigint references areas(id) on delete set null,
  sub_area_id bigint references sub_areas(id) on delete set null,
  district_id bigint references districts(id) on delete set null,
  sales_id bigint references sales_team(id) on delete set null,
  product_id bigint references products(id) on delete set null,
  
  customer_type text,
  status text default 'New',
  rfs_date date,
  phones text[], -- Array of phone numbers
  emails text[], -- Array of emails
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
-- For development, we'll enable permissive policies
-- In production, you should restrict these based on user roles

ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES (Development - Allow All)
-- ============================================
-- Note: These policies allow all operations for development
-- Modify them for production based on your auth requirements

-- Areas Policies
DROP POLICY IF EXISTS "Enable all access for areas" ON areas;
CREATE POLICY "Enable all access for areas" ON areas FOR ALL USING (true) WITH CHECK (true);

-- Sub Areas Policies
DROP POLICY IF EXISTS "Enable all access for sub_areas" ON sub_areas;
CREATE POLICY "Enable all access for sub_areas" ON sub_areas FOR ALL USING (true) WITH CHECK (true);

-- Districts Policies
DROP POLICY IF EXISTS "Enable all access for districts" ON districts;
CREATE POLICY "Enable all access for districts" ON districts FOR ALL USING (true) WITH CHECK (true);

-- Products Policies
DROP POLICY IF EXISTS "Enable all access for products" ON products;
CREATE POLICY "Enable all access for products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Promos Policies
DROP POLICY IF EXISTS "Enable all access for promos" ON promos;
CREATE POLICY "Enable all access for promos" ON promos FOR ALL USING (true) WITH CHECK (true);

-- Sales Team Policies
DROP POLICY IF EXISTS "Enable all access for sales_team" ON sales_team;
CREATE POLICY "Enable all access for sales_team" ON sales_team FOR ALL USING (true) WITH CHECK (true);

-- Targets Policies
DROP POLICY IF EXISTS "Enable all access for targets" ON targets;
CREATE POLICY "Enable all access for targets" ON targets FOR ALL USING (true) WITH CHECK (true);

-- Prospects Policies
DROP POLICY IF EXISTS "Enable all access for prospects" ON prospects;
CREATE POLICY "Enable all access for prospects" ON prospects FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- INSERT SAMPLE DATA (Optional)
-- ============================================
-- Uncomment the sections below if you want sample data

-- Sample Areas
-- INSERT INTO areas (name) VALUES 
--   ('Jabodetabek'),
--   ('Jawa Barat'),
--   ('Jawa Tengah')
-- ON CONFLICT DO NOTHING;

-- Sample Sub Areas (Cities)
-- INSERT INTO sub_areas (area_id, name) VALUES 
--   (1, 'Jakarta Selatan'),
--   (1, 'Tangerang'),
--   (1, 'Bekasi')
-- ON CONFLICT DO NOTHING;

-- Sample Products
-- INSERT INTO products (name, price, description) VALUES 
--   ('Paket Home 10 Mbps', 200000, 'Internet rumah 10 Mbps unlimited'),
--   ('Paket Home 20 Mbps', 300000, 'Internet rumah 20 Mbps unlimited'),
--   ('Paket Home 50 Mbps', 500000, 'Internet rumah 50 Mbps unlimited'),
--   ('Paket Business 100 Mbps', 1000000, 'Internet bisnis 100 Mbps dengan SLA')
-- ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your tables are created:

-- SELECT 'areas' as table_name, COUNT(*) as row_count FROM areas
-- UNION ALL
-- SELECT 'sub_areas', COUNT(*) FROM sub_areas
-- UNION ALL
-- SELECT 'districts', COUNT(*) FROM districts
-- UNION ALL
-- SELECT 'products', COUNT(*) FROM products
-- UNION ALL
-- SELECT 'promos', COUNT(*) FROM promos
-- UNION ALL
-- SELECT 'sales_team', COUNT(*) FROM sales_team
-- UNION ALL
-- SELECT 'targets', COUNT(*) FROM targets
-- UNION ALL
-- SELECT 'prospects', COUNT(*) FROM prospects;
