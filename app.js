const express = require('express');
const path = require('path');
const config = require('./config/appConfig');
const db = require('./config/database');
const logger = require('./middlewares/logger');
const { sessionMiddleware } = require('./middlewares/auth');
const routes = require('./routes'); 

const app = express();
const PORT = config.port;

// Konfigurasi View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware parsing request body (JSON & URL-Encoded Form Data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasang Session & Auth Middleware
app.use(sessionMiddleware);

// Pasang Custom Middleware Logger (Mencatat Method, Path, Status, Timestamp)
app.use(logger);

// Hubungkan Seluruh Rute Aplikasi (Frontend Web & REST API CRUD)
app.use('/', routes);

// Inisialisasi Koneksi Database dan Jalankan Server
async function startServer() {
    console.log(`[INFO] Menginisialisasi koneksi database...`);
    await db.initDb();

    app.listen(PORT, () => {
        console.log(`=================================================`);
        console.log(`🚀 ${config.appName} (EJS MVC & Database CRUD) berjalan di: http://localhost:${PORT}`);
        console.log(`💾 Status Database     : ${db.isConnected ? 'PostgreSQL Terhubung' : 'Data Store Aktif'}`);
        console.log(`📡 Endpoint API Status : http://localhost:${PORT}/api/status`);
        console.log(`💻 Endpoint API Produk : http://localhost:${PORT}/api/produk (GET, POST)`);
        console.log(`🔍 Endpoint API Detail : http://localhost:${PORT}/api/produk/:id (GET, PUT, DELETE)`);
        console.log(`=================================================`);
    });
}

startServer();

module.exports = app;
