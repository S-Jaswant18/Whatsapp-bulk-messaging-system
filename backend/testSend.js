import { sendTextMessage } from './services/whatsappService.js';
import dotenv from 'dotenv';
dotenv.config();

async function testSend() {
    try {
        console.log("Token in test:", process.env.WHATSAPP_TOKEN?.substring(0, 15) + '...');
        const res = await sendTextMessage('919159039389', 'Hello from Local Test Script!');
        console.log('Success:', res);
    } catch (e) {
        console.error('Failed:', e);
    }
}
testSend();
