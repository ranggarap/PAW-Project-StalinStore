const produkModel = require('../models/produkModel');
const config = require('../config/appConfig');
const db = require('../config/database');
const { formatRupiah, formatDate } = require('../utils/formatter');

// ==========================================
// 1. KONTROLER FRONTEND WEB (EJS VIEWS)
// ==========================================

// READ ALL: Halaman Utama Katalog dengan Pencarian & Filter Database
const getHomePage = async (req, res) => {
    try {
        const q = req.query.q || '';
        const kategori = req.query.kategori || 'Semua Kategori';
        const lokasi = req.query.lokasi || 'Semua Lokasi';

        const filteredProduk = await produkModel.getAll({ q, kategori, lokasi });
        const totalProduk = await produkModel.count();

        res.render('index', { 
            title: `${config.appName} - Jual Beli Komputer & Hardware Bekas / Baru`,
            appName: config.appName,
            produk: filteredProduk,
            totalProduk,
            q,
            selectedKategori: kategori,
            selectedLokasi: lokasi,
            dbConnected: db.isConnected,
            formatRupiah
        });
    } catch (err) {
        console.error('Error getHomePage:', err);
        res.status(500).send('Terjadi kesalahan saat memuat data katalog.');
    }
};

// READ ONE: Halaman Detail Produk
const getDetailProduk = async (req, res) => {
    try {
        const id = req.params.id;
        const produk = await produkModel.getById(id);

        if (!produk) {
            const allProducts = await produkModel.getAll();
            const totalProduk = await produkModel.count();
            return res.status(404).render('index', {
                title: `${config.appName} - Produk Tidak Ditemukan`,
                appName: config.appName,
                produk: allProducts,
                totalProduk,
                q: '',
                selectedKategori: 'Semua Kategori',
                selectedLokasi: 'Semua Lokasi',
                dbConnected: db.isConnected,
                formatRupiah
            });
        }

        const isOwner = req.session.user && produk.penjual && Number(req.session.user.id) === Number(produk.penjual.id);

        res.render('detail', {
            title: `${produk.nama} - ${config.appName}`,
            produk,
            isOwner,
            formatRupiah
        });
    } catch (err) {
        console.error('Error getDetailProduk:', err);
        res.status(500).send('Terjadi kesalahan saat memuat detail produk.');
    }
};

// CREATE (VIEW): Halaman Form Pasang Iklan (+ JUAL)
const getJualPage = (req, res) => {
    res.render('jual', {
        title: 'Pasang Iklan Hardware - Stalin Store',
        error: null
    });
};

// CREATE (ACTION): Simpan Iklan Baru ke Database
const postJualProduk = async (req, res) => {
    try {
        const { nama, kategori, harga, kondisi, lokasi, gambar, deskripsi } = req.body;

        if (!nama || !harga) {
            return res.render('jual', {
                title: 'Pasang Iklan Hardware - Stalin Store',
                error: 'Nama produk dan Harga wajib diisi!'
            });
        }

        const sellerUser = req.session.user || {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: lokasi || "Sleman, D.I. Yogyakarta"
        };

        const newAd = await produkModel.create({
            nama,
            kategori,
            harga,
            kondisi,
            lokasi: lokasi || sellerUser.lokasi,
            gambar,
            deskripsi,
            penjual: {
                id: sellerUser.id,
                nama: sellerUser.nama,
                no_hp: sellerUser.no_hp,
                lokasi: lokasi || sellerUser.lokasi
            }
        });

        req.session.flash = {
            type: 'success',
            message: 'Iklan hardware baru berhasil ditambahkan ke database!'
        };

        res.redirect(`/produk/${newAd.id}`);
    } catch (err) {
        console.error('Error postJualProduk:', err);
        res.render('jual', {
            title: 'Pasang Iklan Hardware - Stalin Store',
            error: 'Gagal menyimpan produk ke database: ' + err.message
        });
    }
};

// UPDATE (VIEW): Halaman Form Edit Iklan Produk
const getEditPage = async (req, res) => {
    try {
        const id = req.params.id;
        const produk = await produkModel.getById(id);

        if (!produk) {
            req.session.flash = {
                type: 'warning',
                message: 'Produk yang ingin diedit tidak ditemukan!'
            };
            return res.redirect('/');
        }

        res.render('edit', {
            title: `Edit Iklan: ${produk.nama} - Stalin Store`,
            produk,
            error: null
        });
    } catch (err) {
        console.error('Error getEditPage:', err);
        res.redirect('/');
    }
};

// UPDATE (ACTION): Simpan Perubahan Produk ke Database
const postUpdateProduk = async (req, res) => {
    try {
        const id = req.params.id;
        const { nama, kategori, harga, kondisi, lokasi, gambar, deskripsi, stok } = req.body;

        if (!nama || !harga) {
            const produk = await produkModel.getById(id);
            return res.render('edit', {
                title: `Edit Iklan: ${nama} - Stalin Store`,
                produk: { ...produk, ...req.body },
                error: 'Nama produk dan Harga tidak boleh kosong!'
            });
        }

        const isAvailable = stok === 'true' || stok === true || stok === 'on';

        const updated = await produkModel.update(id, {
            nama,
            kategori,
            harga,
            kondisi,
            lokasi,
            gambar,
            deskripsi,
            stok: isAvailable
        });

        if (!updated) {
            return res.status(404).send('Produk tidak ditemukan untuk diperbarui.');
        }

        req.session.flash = {
            type: 'success',
            message: 'Data iklan produk berhasil diperbarui di database!'
        };

        res.redirect(`/produk/${id}`);
    } catch (err) {
        console.error('Error postUpdateProduk:', err);
        res.redirect(`/produk/${req.params.id}`);
    }
};

// DELETE (ACTION): Hapus Produk dari Database
const postDeleteProduk = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await produkModel.delete(id);

        if (!deleted) {
            req.session.flash = {
                type: 'warning',
                message: 'Produk yang ingin dihapus tidak ditemukan!'
            };
        } else {
            req.session.flash = {
                type: 'success',
                message: 'Iklan produk telah berhasil dihapus dari database!'
            };
        }

        const referer = req.get('Referrer') || '';
        if (referer.includes('/profile')) {
            return res.redirect('/profile');
        }
        res.redirect('/');
    } catch (err) {
        console.error('Error postDeleteProduk:', err);
        res.redirect('/');
    }
};

// TOGGLE STOK: Ubah Status Ketersediaan (Tersedia / Terjual)
const postToggleStok = async (req, res) => {
    try {
        const id = req.params.id;
        await produkModel.toggleStok(id);
        const referer = req.get('Referrer') || `/produk/${id}`;
        res.redirect(referer);
    } catch (err) {
        console.error('Error postToggleStok:', err);
        res.redirect('/');
    }
};


// ==========================================
// 2. KONTROLER REST API (CRUD JSON ENDPOINTS)
// ==========================================

// GET /api/status - Status Server dan Koneksi Database
const getStatusAPI = (req, res) => {
    res.status(200).json({
        status: "ok",
        app: `${config.appName} REST API`,
        database: db.isConnected ? "PostgreSQL (Connected)" : "Standalone Data Store (Active)",
        message: "Server Backend Stalin Store berjalan normal dan siap melayani request API",
        timestamp: formatDate()
    });
};

// GET /api/produk - Mengambil Seluruh Produk dari Database
const getProdukAPI = async (req, res) => {
    try {
        const data = await produkModel.getAll(req.query);
        res.status(200).json({
            sukses: true,
            pesan: "Daftar produk berhasil diambil dari database",
            total: data.length,
            data
        });
    } catch (err) {
        res.status(500).json({
            sukses: false,
            pesan: "Gagal mengambil data produk dari database",
            error: err.message
        });
    }
};

// GET /api/produk/:id - Mengambil Detail Satu Produk Berdasarkan ID
const getDetailProdukAPI = async (req, res) => {
    try {
        const id = req.params.id;
        const produk = await produkModel.getById(id);

        if (!produk) {
            return res.status(404).json({
                sukses: false,
                pesan: `Produk dengan ID ${id} tidak ditemukan di database`
            });
        }

        res.status(200).json({
            sukses: true,
            pesan: "Detail produk berhasil diambil dari database",
            data: produk
        });
    } catch (err) {
        res.status(500).json({
            sukses: false,
            pesan: "Gagal mengambil detail produk",
            error: err.message
        });
    }
};

// POST /api/produk - Menambahkan Data Baru ke Dalam Database
const createProdukAPI = async (req, res) => {
    try {
        const { nama, kategori, harga, kondisi, lokasi, gambar, deskripsi } = req.body;

        if (!nama || !harga) {
            return res.status(400).json({
                sukses: false,
                pesan: "Validasi gagal: Atribut 'nama' dan 'harga' wajib disertakan!"
            });
        }

        const newProduct = await produkModel.create({
            nama,
            kategori,
            harga,
            kondisi,
            lokasi,
            gambar,
            deskripsi,
            stok: req.body.stok !== undefined ? req.body.stok : true,
            penjual: req.body.penjual || {
                id: 1,
                nama: "Budi Hartono",
                no_hp: "0812-3456-7890",
                lokasi: lokasi || "Sleman, D.I. Yogyakarta"
            }
        });

        res.status(201).json({
            sukses: true,
            pesan: "Data produk baru berhasil disimpan ke dalam database",
            data: newProduct
        });
    } catch (err) {
        res.status(500).json({
            sukses: false,
            pesan: "Gagal menambahkan data produk ke database",
            error: err.message
        });
    }
};

// PUT /api/produk/:id - Memperbarui Data Berdasarkan ID
const updateProdukAPI = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await produkModel.getById(id);

        if (!existing) {
            return res.status(404).json({
                sukses: false,
                pesan: `Produk dengan ID ${id} tidak ditemukan di database`
            });
        }

        const updated = await produkModel.update(id, req.body);

        res.status(200).json({
            sukses: true,
            pesan: `Data produk dengan ID ${id} berhasil diperbarui di database`,
            data: updated
        });
    } catch (err) {
        res.status(500).json({
            sukses: false,
            pesan: "Gagal memperbarui data produk di database",
            error: err.message
        });
    }
};

// DELETE /api/produk/:id - Menghapus Data Berdasarkan ID
const deleteProdukAPI = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await produkModel.getById(id);

        if (!existing) {
            return res.status(404).json({
                sukses: false,
                pesan: `Produk dengan ID ${id} tidak ditemukan di database`
            });
        }

        await produkModel.delete(id);

        res.status(200).json({
            sukses: true,
            pesan: `Produk dengan ID ${id} berhasil dihapus dari database`,
            data: { id: Number(id) }
        });
    } catch (err) {
        res.status(500).json({
            sukses: false,
            pesan: "Gagal menghapus data produk dari database",
            error: err.message
        });
    }
};

module.exports = {
    // Web Views
    getHomePage,
    getDetailProduk,
    getJualPage,
    postJualProduk,
    getEditPage,
    postUpdateProduk,
    postDeleteProduk,
    postToggleStok,
    // REST API Endpoints
    getStatusAPI,
    getProdukAPI,
    getDetailProdukAPI,
    createProdukAPI,
    updateProdukAPI,
    deleteProdukAPI
};
