const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

// ==========================================
// 1. ROUTE WEB UTAMA & KATALOG
// ==========================================
router.get('/', mainController.getHomePage);
router.get('/produk/:id', mainController.getDetailProduk);

// ==========================================
// 2. ROUTE FRONTEND CRUD PRODUK (CREATE, UPDATE, DELETE, TOGGLE)
// ==========================================
// Create: Tambah Iklan
router.get('/jual', requireAuth, mainController.getJualPage);
router.post('/jual', requireAuth, mainController.postJualProduk);

// Update: Edit Iklan
router.get('/produk/:id/edit', requireAuth, mainController.getEditPage);
router.post('/produk/:id/edit', requireAuth, mainController.postUpdateProduk);

// Delete: Hapus Iklan
router.post('/produk/:id/delete', requireAuth, mainController.postDeleteProduk);

// Toggle Status Stok (Tersedia / Terjual)
router.post('/produk/:id/toggle-stok', requireAuth, mainController.postToggleStok);

// ==========================================
// 3. ROUTE OTENTIKASI & PROFIL AKUN
// ==========================================
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.postRegister);
router.get('/logout', authController.getLogout);
router.get('/profile', requireAuth, authController.getProfilePage);
router.post('/profile', requireAuth, authController.postUpdateProfile);

// ==========================================
// 4. ROUTE REST API CRUD (KETENTUAN EVALUASI PPAW)
// ==========================================
// Status Server & Database
router.get('/api/status', mainController.getStatusAPI);

// CRUD Produk REST API
router.get('/api/produk', mainController.getProdukAPI);
router.get('/api/produk/:id', mainController.getDetailProdukAPI);
router.post('/api/produk', mainController.createProdukAPI);
router.put('/api/produk/:id', mainController.updateProdukAPI);
router.delete('/api/produk/:id', mainController.deleteProdukAPI);

module.exports = router;
