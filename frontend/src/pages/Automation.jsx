import React, { useState, useEffect } from 'react';
import {
    Plus,
    Bot,
    Trash2,
    MessageSquare,
    Zap,
    MoreVertical,
    Activity,
    ChevronRight
} from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const Automation = () => {
    const [rules, setRules] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newRule, setNewRule] = useState({ trigger_keyword: '', reply_template: '' });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await api.get('/chatbot');
            setRules(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/chatbot', newRule);
            setShowAddModal(false);
            setNewRule({ trigger_keyword: '', reply_template: '' });
            fetchRules();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this rule?')) {
            await api.delete(`/chatbot/${id}`);
            fetchRules();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight">Automation</h1>
                    <p className="text-slate-500 mt-1">Configure keyword-based auto-replies and chatbots.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
                >
                    <Plus size={20} />
                    <span>New Rule</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rules.map((rule) => (
                    <div key={rule.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>

                        <div className="flex items-center justify-between mb-6 relative">
                            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                                <Zap size={22} />
                            </div>
                            <button
                                onClick={() => handleDelete(rule.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="relative">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trigger Keyword</h4>
                            <p className="text-lg font-bold text-slate-900 mb-4 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg inline-block">
                                "{rule.trigger_keyword}"
                            </p>

                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reply Template</h4>
                            <p className="text-sm font-medium text-slate-600 line-clamp-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                {rule.reply_template}
                            </p>
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Activity size={12} className="text-green-500" />
                                Active
                            </div>
                            <span>ID: {rule.id}</span>
                        </div>
                    </div>
                ))}

                {!loading && rules.length === 0 && (
                    <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <Bot size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No automation rules</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-6">Create keyword triggers to automatically reply to incoming customer messages.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="text-blue-600 font-bold flex items-center gap-1"
                        >
                            Add your first rule <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md"
                        >
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-900">Create Automation Rule</h3>
                            </div>
                            <form onSubmit={handleCreate} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Trigger Keyword</label>
                                    <input
                                        type="text"
                                        required
                                        value={newRule.trigger_keyword}
                                        onChange={(e) => setNewRule({ ...newRule, trigger_keyword: e.target.value })}
                                        placeholder="e.g. hello, help, price"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-tighter">* Bot will reply when message contains this word</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Auto-Reply Template</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={newRule.reply_template}
                                        onChange={(e) => setNewRule({ ...newRule, reply_template: e.target.value })}
                                        placeholder="e.g. welcome_template_v1"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none shadow-inner"
                                    ></textarea>
                                    <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-tighter">* Must be a valid Meta Template Name</p>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                                    >
                                        Create Rule
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Automation;
