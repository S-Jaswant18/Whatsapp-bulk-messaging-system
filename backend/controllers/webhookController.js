import prisma from '../config/prisma.js';
import dotenv from 'dotenv';
import { sendTextMessage } from '../services/whatsappService.js';
import { normalizePhone } from '../utils/phone.js';

dotenv.config();

export const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
};

export const receiveWebhook = async (req, res) => {
    try {
        const body = req.body;

        if (body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const message = body.entry[0].changes[0].value.messages[0];
                const rawFrom = message.from;
                const from = normalizePhone(rawFrom);

                // FIXED: Use optional chaining to prevent crash if .text is missing
                const msgBody = message.text?.body || `Received a ${message.type} message`;
                const messageId = message.id;

                console.log(`Incoming message from ${from}: ${msgBody}`);

                // 1. Find or create contact
                let contact = await prisma.contact.findFirst({
                    where: {
                        phone: {
                            contains: from.slice(-10) // Match last 10 digits as fallback
                        }
                    }
                });

                // If no exact match, try looking for just the digits
                if (!contact) {
                    const allContacts = await prisma.contact.findMany();
                    contact = allContacts.find(c => normalizePhone(c.phone).includes(from) || from.includes(normalizePhone(c.phone)));
                }

                // 2. Store incoming message
                await prisma.message.create({
                    data: {
                        contact_id: contact?.id,
                        message_id: messageId,
                        content: msgBody,
                        status: 'delivered',
                        is_incoming: true
                    }
                });

                // 3. Chatbot Logic (only if it's text)
                if (contact && message.text) {
                    const rules = await prisma.chatbotRule.findMany({
                        where: { user_id: contact.user_id }
                    });

                    for (const rule of rules) {
                        if (msgBody.toLowerCase().includes(rule.trigger_keyword.toLowerCase())) {
                            await sendTextMessage(from, rule.reply_template);
                            break;
                        }
                    }
                }

                // 4. Update Socket.io
                if (global.io) {
                    // Emit to all listeners (dashboard)
                    global.io.emit('new_message', { from, content: msgBody, messageId });
                    global.io.emit('dashboard_update');
                    // Emit to a specific room for the contact so the chat UI receives it instantly
                    // Use THE NORMALIZED PHONE for the room
                    const roomName = `room_${from}`;
                    console.log(`Emitting room_message to ${roomName}`);
                    global.io.to(roomName).emit('room_message', { from, content: msgBody, messageId });
                }
            }

            // Handle Status Updates (sent, delivered, read)
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0].value.statuses &&
                body.entry[0].changes[0].value.statuses[0]
            ) {
                const statusUpdate = body.entry[0].changes[0].value.statuses[0];
                const msgId = statusUpdate.id;
                const status = statusUpdate.status;

                await prisma.message.updateMany({
                    where: { message_id: msgId },
                    data: { status }
                });

                if (global.io) {
                    global.io.emit('status_update', { messageId: msgId, status });
                    global.io.emit('dashboard_update');
                }
            }

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Webhook processing error:', error);
        // Important: Always send 200/202 to Meta to acknowledge receipt, even on local errors
        res.sendStatus(200);
    }
};
