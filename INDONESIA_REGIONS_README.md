# 🗺️ Indonesia Regions Integration

## Overview
Aplikasi NetSales sekarang menggunakan data wilayah Indonesia yang lengkap (Provinsi, Kota/Kabupaten, Kecamatan) dengan fokus pada area Jabodetabek.

## 📊 Data Structure

```
Areas (Provinsi/Region)
└── Sub Areas (Kota/Kabupaten)
    └── Districts (Kecamatan)
```

### Contoh Hierarki:
- **Jabodetabek** (Area)
  - Jakarta Selatan (Sub Area / Kota)
    - Kebayoran Baru (District / Kecamatan)
    - Cilandak (District / Kecamatan)
    - Tebet (District / Kecamatan)
  - Tangerang Selatan (Sub Area / Kota)
    - Serpong (District / Kecamatan)
    - Pondok Aren (District / Kecamatan)
    - Ciputat (District / Kecamatan)

## 🚀 Setup Instructions

### 1. Run SQL Seed Script in Supabase

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy paste isi file `seed_indonesia_regions.sql`
3. Klik **Run** untuk execute script
4. Verifikasi data dengan query di akhir script

### 2. Data yang Di-seed

Script akan mengisi:
- ✅ **3 Areas**: Jabodetabek, Jawa Barat, Banten
- ✅ **12 Cities**: Jakarta (5 wilayah), Tangerang, Tangerang Selatan, Depok, Bekasi, dll
- ✅ **100+ Districts**: Kecamatan di seluruh Jabodetabek

### 3. Fitur Auto-populate

Ketika user memilih:
- **Area "Jabodetabek"** → Otomatis muncul pilihan kota Jakarta, Tangerang, Depok, Bekasi
- **City "Jakarta Selatan"** → Otomatis muncul pilihan kecamatan: Kebayoran Baru, Cilandak, Tebet, dll
- **City "Tangerang"** → Otomatis muncul pilihan kecamatan: Ciledug, Karawaci, Cipondoh, dll

## 📝 Usage in Application

### Di Halaman Prospects
```javascript
// User flow:
1. Pilih Area: "Jabodetabek"
2. Pilih City: "Jakarta Selatan" (auto-filtered)
3. Pilih District: "Kebayoran Baru" (auto-filtered)
```

### Di Halaman Master Data → Districts
```javascript
// Admin dapat:
1. Pilih Area untuk melihat cities
2. Pilih City untuk melihat/manage districts
3. Add/Delete districts per city
```

## 🔧 Extending Data

Untuk menambah wilayah lain (misal: Bandung, Surabaya):

### Option 1: Manual via UI
1. Buka **Master Data → Regional**
2. Tambah Area baru (misal: "Jawa Timur")
3. Tambah Sub Area (misal: "Surabaya")
4. Buka **Master Data → Districts**
5. Tambah Districts untuk Surabaya

### Option 2: Via SQL
Edit file `seed_indonesia_regions.sql` dan tambahkan:

```sql
-- Add new area
INSERT INTO areas (id, name) VALUES (4, 'Jawa Timur');

-- Add cities
INSERT INTO sub_areas (id, area_id, name) VALUES
(3578, 4, 'Kota Surabaya'),
(3579, 4, 'Kota Malang');

-- Add districts
INSERT INTO districts (id, sub_area_id, name) VALUES
(357801, 3578, 'Gubeng'),
(357802, 3578, 'Tegalsari'),
(357803, 3578, 'Genteng');
```

## 📚 Data Source

Data wilayah Indonesia bersumber dari:
- [cahyadsn/wilayah](https://github.com/cahyadsn/wilayah) - Public Domain
- Kemendagri RI - Kode dan Data Wilayah Administrasi Pemerintahan

## 🎯 Benefits

1. ✅ **Konsistensi Data**: Semua user menggunakan nama wilayah yang sama
2. ✅ **Auto-complete**: Mengurangi typo dan kesalahan input
3. ✅ **Filtering Otomatis**: City dan District ter-filter berdasarkan pilihan sebelumnya
4. ✅ **Scalable**: Mudah ditambahkan wilayah baru
5. ✅ **Real Indonesia Data**: Menggunakan data resmi wilayah Indonesia

## 📞 Support

Jika ada pertanyaan atau butuh menambah wilayah lain, silakan hubungi tim development.
