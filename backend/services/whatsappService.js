import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API_VERSION = 'v18.0';

const whatsappApi = axios.create({
  baseURL: `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}`,
  headers: {
    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const sendTemplateMessage = async (to, templateName, languageCode = 'en') => {
  try {
    const response = await whatsappApi.post('/messages', {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
      },
    });
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const sendTextMessage = async (to, text) => {
  try {
    const response = await whatsappApi.post('/messages', {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: text },
    });
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const markAsRead = async (messageId) => {
  try {
    const response = await whatsappApi.post('/messages', {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    });
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    throw error;
  }
};
