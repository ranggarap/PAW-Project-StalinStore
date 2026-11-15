const geminiConfig = require('../config/gemini');

// Pola kata kunci berbahaya yang terindikasi sebagai upaya Prompt Injection
const PROMPT_INJECTION_PATTERNS = [
    /ignore (all )?(previous|prior) instructions/i,
    /forget (all )?(previous|prior|system) prompt/i,
    /you are now (an unfiltered|a hacker|a completely different)/i,
    /pretend (you have no rules|to be evil|you are not an ai)/i,
    /jailbreak/i,
    /dan mode/i,
    /abaikan (semua )?(instruksi|aturan|perintah) sebelumnya/i,
    /lupakan (semua )?aturan/i,
    /kamu sekarang adalah hacker/i,
    /bypass safety/i
];

/**
 * Middleware validasi pesan pengguna untuk AI Assistant
 */
const validateChatInput = (req, res, next) => {
    const { message } = req.body;

    // 1. Validasi input kosong / tidak terdefinisi
    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Pesan tidak boleh kosong! Silakan ketik pertanyaan seputar produk atau panduan rakit PC.'
        });
    }

    const trimmedMessage = message.trim();

    // 2. Validasi panjang pesan (maksimal 500 karakter sesuai guardrail PRD)
    if (trimmedMessage.length > geminiConfig.maxInputLength) {
        return res.status(400).json({
            success: false,
            error: `Pesan terlalu panjang (${trimmedMessage.length} karakter). Batas maksimal adalah ${geminiConfig.maxInputLength} karakter demi efisiensi proses.`
        });
    }

    // 3. Deteksi Prompt Injection
    const isInjection = PROMPT_INJECTION_PATTERNS.some(pattern => pattern.test(trimmedMessage));
    if (isInjection) {
        return res.status(200).json({
            success: true,
            data: {
                reply: '⛔ Maaf, saya mendeteksi instruksi yang mencoba mengabaikan atau mengganti aturan sistem keamanan. Sebagai AI Assistant resmi Stalin Store, saya tetap beroperasi dalam batasan resmi untuk membantu konsultasi hardware, cek stok, dan panduan rakit PC.',
                guardrailBlocked: true
            }
        });
    }

    // Sanitasi sederhana: strip tag HTML
    req.body.sanitizedMessage = trimmedMessage.replace(/<[^>]*>?/gm, '');

    next();
};

module.exports = validateChatInput;
