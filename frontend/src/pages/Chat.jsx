import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
    Send,
    Search,
    MoreVertical,
    Smile,
    Paperclip,
    Check,
    CheckCheck,
    User,
    MessageSquare
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [socket, setSocket] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
        const newSocket = io(baseUrl);
        setSocket(newSocket);

        const normalize = (phone) => phone ? phone.toString().replace(/\D/g, '') : '';

        // Listen for global new_message – use normalized comparison
        newSocket.on('new_message', (msg) => {
            if (selectedContact) {
                const sPhone = normalize(selectedContact.phone);
                const rPhone = normalize(msg.from);
                if (sPhone.includes(rPhone) || rPhone.includes(sPhone)) {
                    setMessages(prev => [...prev, { ...msg, is_incoming: true }]);
                }
            }
        });

        // Listen for room-specific messages
        newSocket.on('room_message', (msg) => {
            console.log('Room message received:', msg);
            if (selectedContact) {
                const sPhone = normalize(selectedContact.phone);
                const rPhone = normalize(msg.from);
                if (sPhone.includes(rPhone) || rPhone.includes(sPhone)) {
                    setMessages(prev => [...prev, { ...msg, is_incoming: true }]);
                }
            }
        });

        // When a contact is selected, join its room (NORMALIZED)
        if (selectedContact) {
            const cleanPhone = normalize(selectedContact.phone);
            // Join 10-digit variant if applicable, or the full 12-digit
            newSocket.emit('joinRoom', cleanPhone);
            if (cleanPhone.length > 10) {
                newSocket.emit('joinRoom', cleanPhone.slice(-10));
            }
            console.log('Joined room for:', cleanPhone);
        }

        return () => newSocket.close();
    }, [selectedContact]);

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedContact) {
            // In a real app, fetch message history for this contact
            setMessages([
                { id: 1, content: 'Hey, how can I help you today?', is_incoming: true, created_at: new Date() },
            ]);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchContacts = async () => {
        try {
            const response = await api.get('/contacts');
            setContacts(response.data);
            if (response.data.length > 0) setSelectedContact(response.data[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        const tempId = Date.now();
        const tempMsg = {
            id: tempId,
            content: newMessage,
            is_incoming: false,
            created_at: new Date(),
            status: 'pending'
        };

        setMessages(prev => [...prev, tempMsg]);
        const textToSend = newMessage;
        setNewMessage('');

        try {
            const response = await api.post('/messages/send', {
                recipientPhone: selectedContact.phone,
                content: textToSend,
                contact_id: selectedContact.id
            });

            if (response.data.success) {
                setMessages(prev => prev.map(m =>
                    m.id === tempId ? { ...m, status: 'sent', message_id: response.data.data.message_id } : m
                ));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => prev.map(m =>
                m.id === tempId ? { ...m, status: 'failed' } : m
            ));
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Chats</h2>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <MoreVertical size={20} />
                    </button>
                </div>
                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedContact?.id === contact.id ? 'bg-white border-y border-slate-100' : 'hover:bg-white/50'}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                    {contact.name[0]}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{contact.name}</h4>
                                    <span className="text-[10px] text-slate-400 font-medium uppercase">12:30 PM</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">Last message content goes here...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50">
                {selectedContact ? (
                    <>
                        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    {selectedContact.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{selectedContact.name}</h4>
                                    <p className="text-xs text-green-500 font-medium">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-500">
                                <Search size={20} className="cursor-pointer hover:text-slate-900" />
                                <MoreVertical size={20} className="cursor-pointer hover:text-slate-900" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f0f2f5] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.is_incoming ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm relative ${msg.is_incoming ? 'bg-white text-slate-900 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        <div className={`flex items-center justify-end gap-1 mt-1 ${msg.is_incoming ? 'text-slate-400' : 'text-blue-100'}`}>
                                            <span className="text-[10px] font-medium">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {!msg.is_incoming && (
                                                <CheckCheck size={14} className={msg.status === 'read' ? 'text-blue-300' : ''} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <form onSubmit={handleSend} className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-slate-400 px-2">
                                    <Smile size={24} className="cursor-pointer hover:text-slate-600" />
                                    <Paperclip size={22} className="cursor-pointer hover:text-slate-600" />
                                </div>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Select a chat to start messaging</h3>
                        <p className="max-w-xs text-sm">Choose a contact from the left list to view conversation history and send real-time messages.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
