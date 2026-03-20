import express from 'express';
import {
  sendMessage,
  sendInteractive,
  sendWhatsAppTest,
  getMessageLogs,
  getContactMessages,
  verifyWebhook,
  receiveWebhook
} from '../controllers/messageController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/send', auth, sendMessage);
router.post('/send-interactive', auth, sendInteractive);
router.post('/test-whatsapp', auth, sendWhatsAppTest);
router.get('/logs', auth, getMessageLogs);
router.get('/contact/:contact_id', auth, getContactMessages);

// Webhook routes (public)
router.get('/webhook', verifyWebhook);
router.post('/webhook', receiveWebhook);

export default router;
