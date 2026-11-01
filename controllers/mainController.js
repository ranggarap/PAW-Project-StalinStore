const produkModel = require('../models/produkModel');
const config = require('../config/appConfig');
const { formatRupiah, formatDate } = require('../utils/formatter');

// Halaman Utama Katalog (OLX Style) dengan Fitur Pencarian & Filter
const getHomePage = (req, res) => {
    const q = req.query.q || '';
    const kategori = req.query.kategori || 'Semua Kategori';
    const lokasi = req.query.lokasi || 'Semua Lokasi';

    const filteredProduk = produkModel.search({ q, kategori, lokasi });

    res.render('index', { 
        title: `${config.appName} - Jual Beli Komputer & Hardware Bekas / Baru`,
        appName: config.appName,
        produk: filteredProduk,
        totalProduk: produkModel.length,
        q,
        selectedKategori: kategori,
        selectedLokasi: lokasi,
        formatRupiah
    });
};

// Halaman Detail Produk
const getDetailProduk = (req, res) => {
    const id = req.params.id;
    const produk = produkModel.getById(id);

    if (!produk) {
        return res.status(404).render('index', {
            title: `${config.appName} - Produk Tidak Ditemukan`,
            appName: config.appName,
            produk: produkModel,
            totalProduk: produkModel.length,
            q: '',
            selectedKategori: 'Semua Kategori',
            selectedLokasi: 'Semua Lokasi',
            formatRupiah
        });
    }

    const isOwner = req.session.user && produk.penjual && req.session.user.id === produk.penjual.id;

    res.render('detail', {
        title: `${produk.nama} - ${config.appName}`,
        produk,
        isOwner,
        formatRupiah
    });
};

// Halaman Form Pasang Iklan (+ JUAL)
const getJualPage = (req, res) => {
    res.render('jual', {
        title: 'Pasang Iklan Hardware - Stalin Store',
        error: null
    });
};

// Proses Simpan Iklan Baru
const postJualProduk = (req, res) => {
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

    const newAd = produkModel.create({
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
        message: 'Iklan hardware Anda berhasil diterbitkan!'
    };

    res.redirect(`/produk/${newAd.id}`);
};

// Toggle status Stok (Tandai Terjual / Tersedia)
const postToggleStok = (req, res) => {
    const id = req.params.id;
    produkModel.toggleStok(id);
    
    // Redirect kembali ke halaman pemanggil
    const referer = req.get('Referrer') || `/produk/${id}`;
    res.redirect(referer);
};

// Endpoint REST API: GET /api/status (Evaluasi Week 7)
const getStatusAPI = (req, res) => {
    res.status(200).json({
        status: "ok",
        app: `${config.appName} API`,
        message: "Server Backend Stalin Store berjalan normal",
        timestamp: formatDate()
    });
};

// Endpoint REST API: GET /api/produk (Evaluasi Week 7)
const getProdukAPI = (req, res) => {
    // Mengembalikan seluruh produk dalam format JSON array valid
    res.status(200).json(produkModel);
};

module.exports = {
    getHomePage,
    getDetailProduk,
    getJualPage,
    postJualProduk,
    postToggleStok,
    getStatusAPI,
    getProdukAPI
};
