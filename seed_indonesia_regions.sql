-- ============================================
-- SEED DATA: Indonesia Regions (Jabodetabek Focus)
-- ============================================
-- This script populates areas, sub_areas, and districts
-- with real Indonesia region data

-- Clear existing data (optional, comment out if you want to keep existing data)
-- DELETE FROM districts;
-- DELETE FROM sub_areas;
-- DELETE FROM areas;

-- 1. INSERT AREAS (Provinces/Regions)
INSERT INTO areas (id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(1, 'Jabodetabek'),
(2, 'Jawa Barat'),
(3, 'Banten')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. INSERT SUB_AREAS (Cities/Kabupaten) for Jabodetabek
INSERT INTO sub_areas (id, area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
-- DKI Jakarta
(3171, 1, 'Jakarta Pusat'),
(3172, 1, 'Jakarta Utara'),
(3173, 1, 'Jakarta Barat'),
(3174, 1, 'Jakarta Selatan'),
(3175, 1, 'Jakarta Timur'),
-- Depok
(3276, 1, 'Kota Depok'),
-- Tangerang (Banten)
(3603, 1, 'Kota Tangerang'),
(3604, 1, 'Kota Tangerang Selatan'),
-- Bekasi
(3275, 1, 'Kota Bekasi'),
-- Kabupaten
(3201, 1, 'Kabupaten Bogor'),
(3216, 1, 'Kabupaten Bekasi'),
(3601, 1, 'Kabupaten Tangerang')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area_id = EXCLUDED.area_id;

-- 3. INSERT DISTRICTS (Kecamatan) for major cities

-- Jakarta Selatan
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(317401, 3174, 'Kebayoran Baru'),
(317402, 3174, 'Kebayoran Lama'),
(317403, 3174, 'Pesanggrahan'),
(317404, 3174, 'Cilandak'),
(317405, 3174, 'Pasar Minggu'),
(317406, 3174, 'Jagakarsa'),
(317407, 3174, 'Mampang Prapatan'),
(317408, 3174, 'Pancoran'),
(317409, 3174, 'Tebet'),
(317410, 3174, 'Setiabudi')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Jakarta Pusat
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(317101, 3171, 'Gambir'),
(317102, 3171, 'Tanah Abang'),
(317103, 3171, 'Menteng'),
(317104, 3171, 'Senen'),
(317105, 3171, 'Cempaka Putih'),
(317106, 3171, 'Johar Baru'),
(317107, 3171, 'Kemayoran'),
(317108, 3171, 'Sawah Besar')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Tangerang
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(360301, 3603, 'Tangerang'),
(360302, 3603, 'Jatiuwung'),
(360303, 3603, 'Batuceper'),
(360304, 3603, 'Benda'),
(360305, 3603, 'Cipondoh'),
(360306, 3603, 'Ciledug'),
(360307, 3603, 'Karawaci'),
(360308, 3603, 'Periuk'),
(360309, 3603, 'Cibodas'),
(360310, 3603, 'Neglasari'),
(360311, 3603, 'Pinang'),
(360312, 3603, 'Karang Tengah'),
(360313, 3603, 'Larangan')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Tangerang Selatan
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(360401, 3604, 'Serpong'),
(360402, 3604, 'Serpong Utara'),
(360403, 3604, 'Pondok Aren'),
(360404, 3604, 'Ciputat'),
(360405, 3604, 'Ciputat Timur'),
(360406, 3604, 'Pamulang'),
(360407, 3604, 'Setu')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Depok
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(327601, 3276, 'Beji'),
(327602, 3276, 'Pancoran Mas'),
(327603, 3276, 'Cipayung'),
(327604, 3276, 'Sukmajaya'),
(327605, 3276, 'Cilodong'),
(327606, 3276, 'Cimanggis'),
(327607, 3276, 'Sawangan'),
(327608, 3276, 'Limo'),
(327609, 3276, 'Cinere'),
(327610, 3276, 'Tapos'),
(327611, 3276, 'Bojongsari')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Bekasi
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(327501, 3275, 'Bekasi Timur'),
(327502, 3275, 'Bekasi Barat'),
(327503, 3275, 'Bekasi Selatan'),
(327504, 3275, 'Bekasi Utara'),
(327505, 3275, 'Rawalumbu'),
(327506, 3275, 'Bantargebang'),
(327507, 3275, 'Pondokgede'),
(327508, 3275, 'Jatiasih'),
(327509, 3275, 'Jatisampurna'),
(327510, 3275, 'Mustikajaya'),
(327511, 3275, 'Pondok Melati'),
(327512, 3275, 'Medan Satria')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Jakarta Barat
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(317301, 3173, 'Cengkareng'),
(317302, 3173, 'Grogol Petamburan'),
(317303, 3173, 'Taman Sari'),
(317304, 3173, 'Tambora'),
(317305, 3173, 'Kebon Jeruk'),
(317306, 3173, 'Kalideres'),
(317307, 3173, 'Palmerah'),
(317308, 3173, 'Kembangan')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Jakarta Timur
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(317501, 3175, 'Pasar Rebo'),
(317502, 3175, 'Ciracas'),
(317503, 3175, 'Cipayung'),
(317504, 3175, 'Makasar'),
(317505, 3175, 'Kramat Jati'),
(317506, 3175, 'Jatinegara'),
(317507, 3175, 'Duren Sawit'),
(317508, 3175, 'Cakung'),
(317509, 3175, 'Pulo Gadung'),
(317510, 3175, 'Matraman')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Jakarta Utara
INSERT INTO districts (id, sub_area_id, name) 
OVERRIDING SYSTEM VALUE 
VALUES
(317201, 3172, 'Penjaringan'),
(317202, 3172, 'Pademangan'),
(317203, 3172, 'Tanjung Priok'),
(317204, 3172, 'Koja'),
(317205, 3172, 'Kelapa Gading'),
(317206, 3172, 'Cilincing')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sub_area_id = EXCLUDED.sub_area_id;

-- Verification Query
SELECT 
    a.name as area,
    COUNT(DISTINCT sa.id) as cities,
    COUNT(d.id) as districts
FROM areas a
LEFT JOIN sub_areas sa ON sa.area_id = a.id
LEFT JOIN districts d ON d.sub_area_id = sa.id
GROUP BY a.id, a.name
ORDER BY a.id;
