const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const validateChatInput = require('../middlewares/validateChatInput');

// Endpoint REST API AI Assistant (Ketentuan Tugas & PRD)
router.post('/api/chat', validateChatInput, chatController.postChatMessage);

// Endpoint Halaman Antarmuka Web AI Assistant (Mobile Web First)
router.get('/chat', chatController.getChatPage);

module.exports = router;
