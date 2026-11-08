const db = require('../config/database');

// Memory Data Store sebagai cadangan aman (seamless fallback bila DB server offline)
let localStore = [
    {
        id: 1,
        nama: "Laptop ASUS ROG Strix SCAR 15 Core i9 RTX 3070Ti",
        kategori: "Laptop",
        harga: 21500000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
        lokasi: "Sleman, D.I. Yogyakarta",
        waktu_post: "Hari ini",
        kondisi: "Bekas",
        deskripsi: "Kondisi mulus 98%, pemakaian pribadi untuk editing & gaming ringan. Kelengkapan fullset original box, charger, manual.",
        penjual: {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: "Sleman, D.I. Yogyakarta"
        }
    },
    {
        id: 2,
        nama: "VGA Card NVIDIA GeForce RTX 4070 Ti Super 16GB GDDR6X",
        kategori: "Komponen PC",
        harga: 14850000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
        lokasi: "Depok, Sleman",
        waktu_post: "Kemarin",
        kondisi: "Baru",
        deskripsi: "Barang Brand New In Box (BNIB), garansi resmi distributor 3 tahun. Siap untuk gaming 4K dan rendering AI.",
        penjual: {
            id: 1,
            nama: "Stalin Official Store",
            no_hp: "0811-2233-4455",
            lokasi: "Depok, Sleman"
        }
    },
    {
        id: 3,
        nama: "PC Gaming Fullset Core i5 Gen 12 + RTX 3060 12GB Siap Libas Game",
        kategori: "Komputer",
        harga: 11200000,
        stok: false,
        gambar: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80",
        lokasi: "Kota Yogyakarta",
        waktu_post: "3 hari yang lalu",
        kondisi: "Bekas",
        deskripsi: "Spek lengkap: i5-12400F, RTX 3060 12GB, RAM 16GB, SSD NVMe 512GB, PSU 650W Bronze. Sudah terpasang Windows 11.",
        penjual: {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: "Kota Yogyakarta"
        }
    },
    {
        id: 4,
        nama: "RAM Corsair Vengeance RGB PRO 32GB (2x16GB) DDR4 3600MHz",
        kategori: "Komponen PC",
        harga: 1450000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
        lokasi: "Bantul, D.I. Yogyakarta",
        waktu_post: "Hari ini",
        kondisi: "Bekas",
        deskripsi: "Kondisi normal tes MemTest86 100% pass tanpa error. Lampu RGB sinkron iCUE. Lifetime warranty.",
        penjual: {
            id: 1,
            nama: "Dian Komputer",
            no_hp: "0877-9988-1122",
            lokasi: "Bantul, D.I. Yogyakarta"
        }
    },
    {
        id: 5,
        nama: "Monitor Gaming Xiaomi Curved 34 Inch WQHD 144Hz FreeSync",
        kategori: "Monitor",
        harga: 4650000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        lokasi: "Sleman, D.I. Yogyakarta",
        waktu_post: "2 hari yang lalu",
        kondisi: "Baru",
        deskripsi: "Layar lengkung 1500R sinematik, resolusi tajam 3440x1440 WQHD, refresh rate 144Hz. No dead pixel garansi toko.",
        penjual: {
            id: 1,
            nama: "Stalin Official Store",
            no_hp: "0811-2233-4455",
            lokasi: "Sleman, D.I. Yogyakarta"
        }
    },
    {
        id: 6,
        nama: "Keyboard Mechanical Keychron K2 Wireless RGB Gateron Brown",
        kategori: "Aksesoris Gaming",
        harga: 1100000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
        lokasi: "Kota Yogyakarta",
        waktu_post: "Hari ini",
        kondisi: "Bekas",
        deskripsi: "Switch Gateron Brown tactile empuk, Bluetooth 5.1 lancar konek ke Mac/Windows, baterai 4000mAh awet berminggu-minggu.",
        penjual: {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: "Kota Yogyakarta"
        }
    },
    {
        id: 7,
        nama: "Processor AMD Ryzen 7 7800X3D Box Garansi Resmi",
        kategori: "Komponen PC",
        harga: 6450000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
        lokasi: "Mlati, Sleman",
        waktu_post: "Kemarin",
        kondisi: "Baru",
        deskripsi: "Prosesor gaming kencang nomor 1 dengan 3D V-Cache teknologi. Segel dus aman garansi resmi 3 tahun.",
        penjual: {
            id: 1,
            nama: "Dian Komputer",
            no_hp: "0877-9988-1122",
            lokasi: "Mlati, Sleman"
        }
    },
    {
        id: 8,
        nama: "Mouse Gaming Wireless Logitech G Pro X Superlight White",
        kategori: "Aksesoris Gaming",
        harga: 1250000,
        stok: false,
        gambar: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
        lokasi: "Sleman, D.I. Yogyakarta",
        waktu_post: "4 hari yang lalu",
        kondisi: "Bekas",
        deskripsi: "Sensor HERO 25K, bobot super ringan di bawah 63 gram. Masih berfungsi normal 100%, batre awet, no double click.",
        penjual: {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: "Sleman, D.I. Yogyakarta"
        }
    }
];

// Helper pemformat baris SQL PostgreSQL menjadi objek produk
function formatDbRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        nama: row.nama,
        kategori: row.kategori,
        harga: Number(row.harga),
        stok: Boolean(row.stok),
        gambar: row.gambar || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        lokasi: row.lokasi || "Sleman, D.I. Yogyakarta",
        waktu_post: row.waktu_post || "Hari ini",
        kondisi: row.kondisi || "Bekas",
        deskripsi: row.deskripsi || "Kondisi hardware terawat dan siap pakai.",
        penjual: {
            id: row.penjual_id || 1,
            nama: row.penjual_nama || "Budi Hartono",
            no_hp: row.penjual_nohp || "0812-3456-7890",
            lokasi: row.penjual_lokasi || row.lokasi || "Sleman, D.I. Yogyakarta"
        },
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

const produkModel = {
    /**
     * READ ALL: Mengambil seluruh data produk dari database dengan filter opsional
     */
    async getAll({ q, kategori, lokasi } = {}) {
        if (db.isConnected) {
            try {
                let queryStr = 'SELECT * FROM produk WHERE 1=1';
                const params = [];

                if (q && q.trim() !== '') {
                    params.push(`%${q.trim()}%`);
                    queryStr += ` AND (nama ILIKE $${params.length} OR deskripsi ILIKE $${params.length} OR kategori ILIKE $${params.length})`;
                }

                if (kategori && kategori !== 'Semua Kategori' && kategori.trim() !== '') {
                    params.push(kategori.trim());
                    queryStr += ` AND LOWER(kategori) = LOWER($${params.length})`;
                }

                if (lokasi && lokasi !== 'Semua Lokasi' && lokasi.trim() !== '') {
                    params.push(`%${lokasi.trim()}%`);
                    queryStr += ` AND lokasi ILIKE $${params.length}`;
                }

                queryStr += ' ORDER BY id DESC';
                const result = await db.query(queryStr, params);
                return result.rows.map(formatDbRow);
            } catch (err) {
                console.error('[DATABASE ERROR in getAll]:', err.message);
            }
        }

        // Fallback filter
        return localStore.filter(item => {
            let matchQ = true;
            let matchKat = true;
            let matchLok = true;

            if (q && q.trim() !== '') {
                const queryStr = q.trim().toLowerCase();
                matchQ = item.nama.toLowerCase().includes(queryStr) ||
                         item.kategori.toLowerCase().includes(queryStr) ||
                         (item.deskripsi && item.deskripsi.toLowerCase().includes(queryStr));
            }

            if (kategori && kategori !== 'Semua Kategori' && kategori.trim() !== '') {
                matchKat = item.kategori.toLowerCase() === kategori.trim().toLowerCase();
            }

            if (lokasi && lokasi !== 'Semua Lokasi' && lokasi.trim() !== '') {
                matchLok = item.lokasi.toLowerCase().includes(lokasi.trim().toLowerCase());
            }

            return matchQ && matchKat && matchLok;
        });
    },

    /**
     * READ DETAIL: Mengambil satu data produk berdasarkan ID
     */
    async getById(id) {
        const numId = Number(id);
        if (isNaN(numId)) return null;

        if (db.isConnected) {
            try {
                const result = await db.query('SELECT * FROM produk WHERE id = $1', [numId]);
                if (result.rows.length > 0) {
                    return formatDbRow(result.rows[0]);
                }
                return null;
            } catch (err) {
                console.error('[DATABASE ERROR in getById]:', err.message);
            }
        }

        const found = localStore.find(item => item.id === numId);
        return found ? { ...found } : null;
    },

    /**
     * CREATE: Menambahkan produk baru ke dalam database
     */
    async create(newProduct) {
        const nama = (newProduct.nama || '').trim();
        const kategori = (newProduct.kategori || 'Komponen PC').trim();
        const harga = Number(newProduct.harga) || 0;
        const stok = newProduct.stok === undefined ? true : Boolean(newProduct.stok);
        const gambar = (newProduct.gambar && newProduct.gambar.trim() !== '')
            ? newProduct.gambar.trim()
            : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80";
        const lokasi = (newProduct.lokasi || 'Sleman, D.I. Yogyakarta').trim();
        const waktu_post = 'Hari ini';
        const kondisi = (newProduct.kondisi || 'Bekas').trim();
        const deskripsi = (newProduct.deskripsi || 'Kondisi hardware terawat dan siap pakai.').trim();

        const seller = newProduct.penjual || {};
        const penjual_id = seller.id ? Number(seller.id) : 1;
        const penjual_nama = seller.nama || 'Budi Hartono';
        const penjual_nohp = seller.no_hp || '0812-3456-7890';
        const penjual_lokasi = seller.lokasi || lokasi;

        if (db.isConnected) {
            try {
                const sql = `
                    INSERT INTO produk (nama, kategori, harga, stok, gambar, lokasi, waktu_post, kondisi, deskripsi, penjual_id, penjual_nama, penjual_nohp, penjual_lokasi)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                    RETURNING *
                `;
                const params = [
                    nama, kategori, harga, stok, gambar, lokasi, waktu_post, kondisi, deskripsi,
                    penjual_id, penjual_nama, penjual_nohp, penjual_lokasi
                ];
                const result = await db.query(sql, params);
                return formatDbRow(result.rows[0]);
            } catch (err) {
                console.error('[DATABASE ERROR in create]:', err.message);
            }
        }

        // Fallback Create
        const nextId = localStore.length > 0 ? Math.max(...localStore.map(p => p.id)) + 1 : 1;
        const fallbackItem = {
            id: nextId,
            nama,
            kategori,
            harga,
            stok,
            gambar,
            lokasi,
            waktu_post,
            kondisi,
            deskripsi,
            penjual: {
                id: penjual_id,
                nama: penjual_nama,
                no_hp: penjual_nohp,
                lokasi: penjual_lokasi
            }
        };
        localStore.unshift(fallbackItem);
        return fallbackItem;
    },

    /**
     * UPDATE: Memperbarui data produk berdasarkan ID di database
     */
    async update(id, updateData) {
        const numId = Number(id);
        if (isNaN(numId)) return null;

        if (db.isConnected) {
            try {
                const existing = await this.getById(numId);
                if (!existing) return null;

                const nama = updateData.nama !== undefined ? updateData.nama.trim() : existing.nama;
                const kategori = updateData.kategori !== undefined ? updateData.kategori.trim() : existing.kategori;
                const harga = updateData.harga !== undefined ? Number(updateData.harga) : existing.harga;
                const stok = updateData.stok !== undefined ? (String(updateData.stok) === 'true' || updateData.stok === true) : existing.stok;
                const gambar = updateData.gambar !== undefined ? updateData.gambar.trim() : existing.gambar;
                const lokasi = updateData.lokasi !== undefined ? updateData.lokasi.trim() : existing.lokasi;
                const kondisi = updateData.kondisi !== undefined ? updateData.kondisi.trim() : existing.kondisi;
                const deskripsi = updateData.deskripsi !== undefined ? updateData.deskripsi.trim() : existing.deskripsi;

                const sql = `
                    UPDATE produk
                    SET nama = $1, kategori = $2, harga = $3, stok = $4, gambar = $5, lokasi = $6, kondisi = $7, deskripsi = $8, updated_at = CURRENT_TIMESTAMP
                    WHERE id = $9
                    RETURNING *
                `;
                const params = [nama, kategori, harga, stok, gambar, lokasi, kondisi, deskripsi, numId];
                const result = await db.query(sql, params);
                if (result.rows.length > 0) {
                    return formatDbRow(result.rows[0]);
                }
                return null;
            } catch (err) {
                console.error('[DATABASE ERROR in update]:', err.message);
            }
        }

        // Fallback Update
        const index = localStore.findIndex(item => item.id === numId);
        if (index === -1) return null;

        const current = localStore[index];
        const updated = {
            ...current,
            nama: updateData.nama !== undefined ? updateData.nama.trim() : current.nama,
            kategori: updateData.kategori !== undefined ? updateData.kategori.trim() : current.kategori,
            harga: updateData.harga !== undefined ? Number(updateData.harga) : current.harga,
            stok: updateData.stok !== undefined ? (String(updateData.stok) === 'true' || updateData.stok === true) : current.stok,
            gambar: updateData.gambar !== undefined ? updateData.gambar.trim() : current.gambar,
            lokasi: updateData.lokasi !== undefined ? updateData.lokasi.trim() : current.lokasi,
            kondisi: updateData.kondisi !== undefined ? updateData.kondisi.trim() : current.kondisi,
            deskripsi: updateData.deskripsi !== undefined ? updateData.deskripsi.trim() : current.deskripsi
        };
        localStore[index] = updated;
        return updated;
    },

    /**
     * DELETE: Menghapus data produk berdasarkan ID dari database
     */
    async delete(id) {
        const numId = Number(id);
        if (isNaN(numId)) return null;

        if (db.isConnected) {
            try {
                const result = await db.query('DELETE FROM produk WHERE id = $1 RETURNING id', [numId]);
                if (result.rows.length > 0) {
                    return { id: numId };
                }
                return null;
            } catch (err) {
                console.error('[DATABASE ERROR in delete]:', err.message);
            }
        }

        // Fallback Delete
        const index = localStore.findIndex(item => item.id === numId);
        if (index === -1) return null;

        localStore.splice(index, 1);
        return { id: numId };
    },

    /**
     * TOGGLE STOK: Ubah status ketersediaan barang (Tersedia / Terjual)
     */
    async toggleStok(id) {
        const numId = Number(id);
        if (isNaN(numId)) return null;

        if (db.isConnected) {
            try {
                const sql = `
                    UPDATE produk
                    SET stok = NOT stok, updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1
                    RETURNING *
                `;
                const result = await db.query(sql, [numId]);
                if (result.rows.length > 0) {
                    return formatDbRow(result.rows[0]);
                }
                return null;
            } catch (err) {
                console.error('[DATABASE ERROR in toggleStok]:', err.message);
            }
        }

        // Fallback Toggle Stok
        const item = localStore.find(p => p.id === numId);
        if (item) {
            item.stok = !item.stok;
            return { ...item };
        }
        return null;
    },

    /**
     * GET BY USER ID: Ambil seluruh produk milik user penjual tertentu
     */
    async getByUserId(userId) {
        const numUserId = Number(userId);

        if (db.isConnected) {
            try {
                const result = await db.query(
                    'SELECT * FROM produk WHERE penjual_id = $1 ORDER BY id DESC',
                    [numUserId]
                );
                return result.rows.map(formatDbRow);
            } catch (err) {
                console.error('[DATABASE ERROR in getByUserId]:', err.message);
            }
        }

        return localStore.filter(item => item.penjual && item.penjual.id === numUserId);
    },

    /**
     * COUNT: Menghitung total seluruh produk
     */
    async count() {
        if (db.isConnected) {
            try {
                const result = await db.query('SELECT COUNT(*) AS total FROM produk');
                return Number(result.rows[0].total);
            } catch (err) {
                console.error('[DATABASE ERROR in count]:', err.message);
            }
        }
        return localStore.length;
    }
};

module.exports = produkModel;
