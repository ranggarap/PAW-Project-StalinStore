const geminiService = require('../services/gemini.service');
const geminiConfig = require('../config/gemini');
const { formatDate, formatRupiah } = require('../utils/formatter');

/**
 * Controller untuk Fitur AI Assistant Stalin Store
 */
const chatController = {
    /**
     * POST /api/chat - Menangani pertanyaan pengguna dan mengembalikan respons AI
     */
    async postChatMessage(req, res) {
        try {
            const message = req.body.sanitizedMessage || req.body.message;
            const startTime = Date.now();

            const result = await geminiService.generateResponse(message);
            const responseTimeMs = Date.now() - startTime;

            return res.status(200).json({
                success: true,
                data: {
                    reply: result.reply,
                    products: result.products || [],
                    guardrailBlocked: Boolean(result.guardrailBlocked),
                    source: result.source || 'gemini',
                    responseTimeMs,
                    timestamp: formatDate()
                }
            });
        } catch (err) {
            console.error('[CHAT CONTROLLER ERROR]:', err);
            return res.status(500).json({
                success: false,
                error: 'Terjadi gangguan teknis pada layanan AI Assistant. Silakan coba kembali atau hubungi WhatsApp admin.',
                details: err.message,
                emergencyContact: {
                    name: geminiConfig.adminName,
                    whatsapp: geminiConfig.adminWhatsApp
                }
            });
        }
    },

    /**
     * GET /chat - Halaman Antarmuka Penuh Asisten AI (Mobile Web First)
     */
    async getChatPage(req, res) {
        res.render('chat', {
            title: 'Stalin Store AI Assistant (Mobile Web) - Konsultasi Hardware 24/7',
            appName: 'Stalin Store',
            adminWhatsApp: geminiConfig.adminWhatsApp,
            adminName: geminiConfig.adminName,
            formatRupiah
        });
    }
};

module.exports = chatController;
