const path = require('path');
const fs = require('fs');

// Muat environment variables dari .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    if (process.loadEnvFile) {
        try {
            process.loadEnvFile(envPath);
        } catch (e) {}
    } else {
        try {
            require('dotenv').config({ path: envPath });
        } catch (e) {}
    }
}

const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS) || 8000, // 8 detik sesuai mitigasi PRD
    maxInputLength: 500, // Batas panjang karakter input pengguna
    adminWhatsApp: '0812-3456-7890',
    adminName: 'Budi Hartono',
    get isConfigured() {
        return Boolean(this.apiKey && this.apiKey.trim().length > 10 && !this.apiKey.includes('your_'));
    }
};

module.exports = geminiConfig;
