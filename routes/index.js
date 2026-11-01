const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

// === 1. ROUTE WEB UTAMA & PRODUK ===
router.get('/', mainController.getHomePage);
router.get('/produk/:id', mainController.getDetailProduk);

// === 2. ROUTE PASANG IKLAN (+ JUAL) ===
router.get('/jual', requireAuth, mainController.getJualPage);
router.post('/jual', requireAuth, mainController.postJualProduk);
router.post('/produk/:id/toggle-stok', requireAuth, mainController.postToggleStok);

// === 3. ROUTE OTENTIKASI & AKUN PROFIL ===
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.postRegister);
router.get('/logout', authController.getLogout);
router.get('/profile', requireAuth, authController.getProfilePage);
router.post('/profile', requireAuth, authController.postUpdateProfile);

// === 4. ROUTE REST API (KETENTUAN WEEK 7) ===
router.get('/api/status', mainController.getStatusAPI);
router.get('/api/produk', mainController.getProdukAPI);

module.exports = router;
