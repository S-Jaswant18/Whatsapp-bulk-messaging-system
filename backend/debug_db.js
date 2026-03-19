import prisma from './config/prisma.js';
const c = await prisma.contact.findMany();
console.log('CONTACTS:', c.map(ct => ({ id: ct.id, name: ct.name, phone: ct.phone })));
const m = await prisma.message.findMany({ take: 5, orderBy: { created_at: 'desc' } });
console.log('LATEST MESSAGES:', m.map(mg => ({ id: mg.id, content: mg.content, is_incoming: mg.is_incoming, contact_id: mg.contact_id, message_id: mg.message_id })));
process.exit(0);
