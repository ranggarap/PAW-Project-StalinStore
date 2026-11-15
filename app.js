const express = require('express');
const path = require('path');
const config = require('./config/appConfig');
const db = require('./config/database');
const geminiConfig = require('./config/gemini');
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

// Hubungkan Seluruh Rute Aplikasi (Frontend Web, REST API CRUD, & AI Assistant)
app.use('/', routes);

// Inisialisasi Koneksi Database dan Jalankan Server
async function startServer() {
    console.log(`[INFO] Menginisialisasi koneksi database...`);
    await db.initDb();

    app.listen(PORT, () => {
        console.log(`=================================================`);
        console.log(`🚀 ${config.appName} (EJS MVC & AI Gemini) berjalan di: http://localhost:${PORT}`);
        console.log(`💾 Status Database     : ${db.isConnected ? 'PostgreSQL Terhubung' : 'Data Store Aktif'}`);
        console.log(`🧠 Status Google Gemini: ${geminiConfig.isConfigured ? 'API Key Terkonfigurasi' : 'Fallback Engine Aktif (PRD Fallback)'}`);
        console.log(`🤖 Halaman AI Assistant: http://localhost:${PORT}/chat`);
        console.log(`📡 Endpoint API Chat   : http://localhost:${PORT}/api/chat (POST)`);
        console.log(`📡 Endpoint API Status : http://localhost:${PORT}/api/status`);
        console.log(`💻 Endpoint API Produk : http://localhost:${PORT}/api/produk (GET, POST)`);
        console.log(`=================================================`);
    });
}

startServer();

module.exports = app;
