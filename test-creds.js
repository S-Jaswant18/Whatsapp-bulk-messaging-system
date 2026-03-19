import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API_VERSION = 'v22.0';

console.log('--- Diagnostic ---');
console.log('Token Length:', WHATSAPP_TOKEN?.length);
console.log('Phone Number ID:', PHONE_NUMBER_ID);

const verify = async () => {
    try {
        const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}`, {
            headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
        });
        console.log('SUCCESS:', response.data);
    } catch (error) {
        console.log('ERROR:', error.response?.data || error.message);
    }
};

verify();
