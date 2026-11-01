const express = require('express');
const path = require('path');
const config = require('./config/appConfig');
const logger = require('./middlewares/logger');
const { sessionMiddleware } = require('./middlewares/auth');
const routes = require('./routes'); 

const app = express();
const PORT = config.port;

// Konfigurasi View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasang Session & Auth Middleware
app.use(sessionMiddleware);

// Pasang Custom Middleware Logger (Ketentuan Week 7)
app.use(logger);

// Hubungkan Seluruh Rute Aplikasi
app.use('/', routes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 ${config.appName} (Full OLX Classifieds) berjalan di: http://localhost:${PORT}`);
    console.log(`👤 Fitur Akun: Login, Register, Profile, & Pasang Iklan aktif`);
    console.log(`📡 Endpoint API Status : http://localhost:${PORT}/api/status`);
    console.log(`💻 Endpoint API Produk : http://localhost:${PORT}/api/produk`);
    console.log(`=================================================`);
});
