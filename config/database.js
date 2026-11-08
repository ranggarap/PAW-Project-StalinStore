const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Muat environment variables dari file .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    if (process.loadEnvFile) {
        try {
            process.loadEnvFile(envPath);
        } catch (e) {
            // Abaikan jika error internal parsing
        }
    } else {
        try {
            require('dotenv').config({ path: envPath });
        } catch (e) {}
    }
}

// Konfigurasi koneksi database PostgreSQL terpusat
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'products_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000
};

// Buat pool koneksi PostgreSQL
let pool = new Pool(dbConfig);
let isDbConnected = false;

/**
 * Eksekusi parameterized query SQL
 * @param {string} text - Query SQL dengan parameter $1, $2, dst.
 * @param {Array} params - Nilai parameter
 */
async function query(text, params) {
    if (!isDbConnected) {
        throw new Error('Database is not currently connected');
    }
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
}

/**
 * Inisialisasi koneksi database, pengecekan tabel & auto-seeding
 */
async function initDb() {
    try {
        // Uji coba koneksi pertama
        let client;
        try {
            client = await pool.connect();
        } catch (connErr) {
            // Jika error adalah database target belum ada (code 3D000)
            if (connErr.code === '3D000') {
                console.log(`[DATABASE] Database "${dbConfig.database}" belum dibuat. Mencoba membuat otomatis...`);
                const adminPool = new Pool({ ...dbConfig, database: 'postgres' });
                try {
                    await adminPool.query(`CREATE DATABASE "${dbConfig.database}"`);
                    console.log(`[DATABASE] Database "${dbConfig.database}" berhasil dibuat!`);
                } finally {
                    await adminPool.end();
                }
                // Hubungkan kembali pool utama
                client = await pool.connect();
            } else {
                throw connErr;
            }
        }

        isDbConnected = true;
        console.log(`[DATABASE] Terhubung ke PostgreSQL (${dbConfig.host}:${dbConfig.port}/${dbConfig.database})`);

        // Buat tabel jika belum ada
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                nama VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                no_hp VARCHAR(50),
                lokasi VARCHAR(100),
                bio TEXT,
                avatar TEXT,
                bergabung VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS produk (
                id SERIAL PRIMARY KEY,
                nama VARCHAR(255) NOT NULL,
                kategori VARCHAR(100) NOT NULL,
                harga BIGINT NOT NULL DEFAULT 0,
                stok BOOLEAN DEFAULT TRUE,
                gambar TEXT,
                lokasi VARCHAR(100),
                waktu_post VARCHAR(50) DEFAULT 'Hari ini',
                kondisi VARCHAR(50) DEFAULT 'Bekas',
                deskripsi TEXT,
                penjual_id INT DEFAULT 1,
                penjual_nama VARCHAR(100) DEFAULT 'Budi Hartono',
                penjual_nohp VARCHAR(50) DEFAULT '0812-3456-7890',
                penjual_lokasi VARCHAR(100) DEFAULT 'Sleman, D.I. Yogyakarta',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_produk_kat ON produk(kategori);
            CREATE INDEX IF NOT EXISTS idx_produk_lok ON produk(lokasi);
        `);

        // Cek dan seeding tabel users jika kosong
        const userCheck = await client.query('SELECT COUNT(*) AS count FROM users');
        if (Number(userCheck.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO users (id, nama, email, password, no_hp, lokasi, bio, avatar, bergabung)
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
                ) ON CONFLICT (id) DO NOTHING;
                SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
            `);
            console.log('[DATABASE] Data awal users berhasil di-seed.');
        }

        // Cek dan seeding tabel produk jika kosong
        const produkCheck = await client.query('SELECT COUNT(*) AS count FROM produk');
        if (Number(produkCheck.rows[0].count) === 0) {
            const seedItems = [
                ['Laptop ASUS ROG Strix SCAR 15 Core i9 RTX 3070Ti', 'Laptop', 21500000, true, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80', 'Sleman, D.I. Yogyakarta', 'Hari ini', 'Bekas', 'Kondisi mulus 98%, pemakaian pribadi untuk editing & gaming ringan. Kelengkapan fullset original box, charger, manual.', 1, 'Budi Hartono', '0812-3456-7890', 'Sleman, D.I. Yogyakarta'],
                ['VGA Card NVIDIA GeForce RTX 4070 Ti Super 16GB GDDR6X', 'Komponen PC', 14850000, true, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', 'Depok, Sleman', 'Kemarin', 'Baru', 'Barang Brand New In Box (BNIB), garansi resmi distributor 3 tahun. Siap untuk gaming 4K dan rendering AI.', 1, 'Stalin Official Store', '0811-2233-4455', 'Depok, Sleman'],
                ['PC Gaming Fullset Core i5 Gen 12 + RTX 3060 12GB Siap Libas Game', 'Komputer', 11200000, false, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80', 'Kota Yogyakarta', '3 hari yang lalu', 'Bekas', 'Spek lengkap: i5-12400F, RTX 3060 12GB, RAM 16GB, SSD NVMe 512GB, PSU 650W Bronze. Sudah terpasang Windows 11.', 1, 'Budi Hartono', '0812-3456-7890', 'Kota Yogyakarta'],
                ['RAM Corsair Vengeance RGB PRO 32GB (2x16GB) DDR4 3600MHz', 'Komponen PC', 1450000, true, 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80', 'Bantul, D.I. Yogyakarta', 'Hari ini', 'Bekas', 'Kondisi normal tes MemTest86 100% pass tanpa error. Lampu RGB sinkron iCUE. Lifetime warranty.', 1, 'Dian Komputer', '0877-9988-1122', 'Bantul, D.I. Yogyakarta'],
                ['Monitor Gaming Xiaomi Curved 34 Inch WQHD 144Hz FreeSync', 'Monitor', 4650000, true, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80', 'Sleman, D.I. Yogyakarta', '2 hari yang lalu', 'Baru', 'Layar lengkung 1500R sinematik, resolusi tajam 3440x1440 WQHD, refresh rate 144Hz. No dead pixel garansi toko.', 1, 'Stalin Official Store', '0811-2233-4455', 'Sleman, D.I. Yogyakarta'],
                ['Keyboard Mechanical Keychron K2 Wireless RGB Gateron Brown', 'Aksesoris Gaming', 1100000, true, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 'Kota Yogyakarta', 'Hari ini', 'Bekas', 'Switch Gateron Brown tactile empuk, Bluetooth 5.1 lancar konek ke Mac/Windows, baterai 4000mAh awet berminggu-minggu.', 1, 'Budi Hartono', '0812-3456-7890', 'Kota Yogyakarta'],
                ['Processor AMD Ryzen 7 7800X3D Box Garansi Resmi', 'Komponen PC', 6450000, true, 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80', 'Mlati, Sleman', 'Kemarin', 'Baru', 'Prosesor gaming kencang nomor 1 dengan 3D V-Cache teknologi. Segel dus aman garansi resmi 3 tahun.', 1, 'Dian Komputer', '0877-9988-1122', 'Mlati, Sleman'],
                ['Mouse Gaming Wireless Logitech G Pro X Superlight White', 'Aksesoris Gaming', 1250000, false, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 'Sleman, D.I. Yogyakarta', '4 hari yang lalu', 'Bekas', 'Sensor HERO 25K, bobot super ringan di bawah 63 gram. Masih berfungsi normal 100%, batre awet, no double click.', 1, 'Budi Hartono', '0812-3456-7890', 'Sleman, D.I. Yogyakarta']
            ];

            for (const item of seedItems) {
                await client.query(`
                    INSERT INTO produk (nama, kategori, harga, stok, gambar, lokasi, waktu_post, kondisi, deskripsi, penjual_id, penjual_nama, penjual_nohp, penjual_lokasi)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                `, item);
            }
            await client.query(`SELECT setval('produk_id_seq', (SELECT MAX(id) FROM produk));`);
            console.log('[DATABASE] Data awal produk hardware berhasil di-seed (8 produk).');
        }

        client.release();
        return true;
    } catch (err) {
        isDbConnected = false;
        console.warn(`[DATABASE WARNING] Tidak dapat terhubung ke PostgreSQL (${err.message}).`);
        console.warn('[DATABASE WARNING] Aplikasi beralih ke Mode Standalone Data Store (Penyimpanan terisolasi aman).');
        return false;
    }
}

module.exports = {
    pool,
    query,
    initDb,
    get isConnected() {
        return isDbConnected;
    },
    config: dbConfig
};
