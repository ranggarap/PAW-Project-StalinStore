-- ============================================================
-- SKEMA DATABASE STALIN STORE (MYSQL / MARIADB)
-- Praktikum Pemrograman Aplikasi Web (PPAW) - Integrasi Database & CRUD
-- ============================================================

CREATE DATABASE IF NOT EXISTS products_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE products_db;

-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    no_hp VARCHAR(50) NULL,
    lokasi VARCHAR(100) NULL,
    bio TEXT NULL,
    avatar TEXT NULL,
    bergabung VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel Produk
CREATE TABLE IF NOT EXISTS produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    harga BIGINT NOT NULL DEFAULT 0,
    stok BOOLEAN DEFAULT TRUE,
    gambar TEXT NULL,
    lokasi VARCHAR(100) NULL,
    waktu_post VARCHAR(50) DEFAULT 'Hari ini',
    kondisi VARCHAR(50) DEFAULT 'Bekas',
    deskripsi TEXT NULL,
    penjual_id INT DEFAULT 1,
    penjual_nama VARCHAR(100) DEFAULT 'Budi Hartono',
    penjual_nohp VARCHAR(50) DEFAULT '0812-3456-7890',
    penjual_lokasi VARCHAR(100) DEFAULT 'Sleman, D.I. Yogyakarta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_kat (kategori),
    INDEX idx_lok (lokasi)
) ENGINE=InnoDB;

-- Seeding User
INSERT IGNORE INTO users (id, nama, email, password, no_hp, lokasi, bio, avatar, bergabung)
VALUES (
    1,
    'Budi Hartono',
    'user@stalinstore.com',
    'password123',
    '0812-3456-7890',
    'Sleman, D.I. Yogyakarta',
    'Kolektor dan penjual hardware komputer bekas & baru terpercaya di Yogyakarta.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'Januari 2024'
);

-- Seeding Produk
INSERT IGNORE INTO produk (id, nama, kategori, harga, stok, gambar, lokasi, waktu_post, kondisi, deskripsi, penjual_id, penjual_nama, penjual_nohp, penjual_lokasi)
VALUES
(1, 'Laptop ASUS ROG Strix SCAR 15 Core i9 RTX 3070Ti', 'Laptop', 21500000, 1, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80', 'Sleman, D.I. Yogyakarta', 'Hari ini', 'Bekas', 'Kondisi mulus 98%, pemakaian pribadi untuk editing & gaming ringan. Kelengkapan fullset original box, charger, manual.', 1, 'Budi Hartono', '0812-3456-7890', 'Sleman, D.I. Yogyakarta'),
(2, 'VGA Card NVIDIA GeForce RTX 4070 Ti Super 16GB GDDR6X', 'Komponen PC', 14850000, 1, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', 'Depok, Sleman', 'Kemarin', 'Baru', 'Barang Brand New In Box (BNIB), garansi resmi distributor 3 tahun. Siap untuk gaming 4K dan rendering AI.', 1, 'Stalin Official Store', '0811-2233-4455', 'Depok, Sleman'),
(3, 'PC Gaming Fullset Core i5 Gen 12 + RTX 3060 12GB Siap Libas Game', 'Komputer', 11200000, 0, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80', 'Kota Yogyakarta', '3 hari yang lalu', 'Bekas', 'Spek lengkap: i5-12400F, RTX 3060 12GB, RAM 16GB, SSD NVMe 512GB, PSU 650W Bronze. Sudah terpasang Windows 11.', 1, 'Budi Hartono', '0812-3456-7890', 'Kota Yogyakarta'),
(4, 'RAM Corsair Vengeance RGB PRO 32GB (2x16GB) DDR4 3600MHz', 'Komponen PC', 1450000, 1, 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80', 'Bantul, D.I. Yogyakarta', 'Hari ini', 'Bekas', 'Kondisi normal tes MemTest86 100% pass tanpa error. Lampu RGB sinkron iCUE. Lifetime warranty.', 1, 'Dian Komputer', '0877-9988-1122', 'Bantul, D.I. Yogyakarta'),
(5, 'Monitor Gaming Xiaomi Curved 34 Inch WQHD 144Hz FreeSync', 'Monitor', 4650000, 1, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80', 'Sleman, D.I. Yogyakarta', '2 hari yang lalu', 'Baru', 'Layar lengkung 1500R sinematik, resolusi tajam 3440x1440 WQHD, refresh rate 144Hz. No dead pixel garansi toko.', 1, 'Stalin Official Store', '0811-2233-4455', 'Sleman, D.I. Yogyakarta'),
(6, 'Keyboard Mechanical Keychron K2 Wireless RGB Gateron Brown', 'Aksesoris Gaming', 1100000, 1, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 'Kota Yogyakarta', 'Hari ini', 'Bekas', 'Switch Gateron Brown tactile empuk, Bluetooth 5.1 lancar konek ke Mac/Windows, baterai 4000mAh awet berminggu-minggu.', 1, 'Budi Hartono', '0812-3456-7890', 'Kota Yogyakarta'),
(7, 'Processor AMD Ryzen 7 7800X3D Box Garansi Resmi', 'Komponen PC', 6450000, 1, 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80', 'Mlati, Sleman', 'Kemarin', 'Baru', 'Prosesor gaming kencang nomor 1 dengan 3D V-Cache teknologi. Segel dus aman garansi resmi 3 tahun.', 1, 'Dian Komputer', '0877-9988-1122', 'Mlati, Sleman'),
(8, 'Mouse Gaming Wireless Logitech G Pro X Superlight White', 'Aksesoris Gaming', 1250000, 0, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 'Sleman, D.I. Yogyakarta', '4 hari yang lalu', 'Bekas', 'Sensor HERO 25K, bobot super ringan di bawah 63 gram. Masih berfungsi normal 100%, batre awet, no double click.', 1, 'Budi Hartono', '0812-3456-7890', 'Sleman, D.I. Yogyakarta');
