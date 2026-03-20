import React, { useState } from 'react';
import {
    User,
    Camera,
    Building,
    Mail,
    Check,
    Shield,
    Key,
    Smartphone,
    QrCode,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_ORIGIN } from '../config/runtime';

const Settings = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        company_name: user?.company_name || '',
        bio: user?.bio || ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [testPhone, setTestPhone] = useState('');
    const [testLoading, setTestLoading] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleWhatsAppTest = async () => {
        if (!testPhone.trim()) {
            alert('Please enter a phone number with country code');
            return;
        }

        setTestLoading(true);
        setTestResult(null);
        try {
            const response = await api.post('/messages/test-whatsapp', {
                recipientPhone: testPhone
            });
            setTestResult({
                success: true,
                message: response.data?.message || 'WhatsApp test sent successfully'
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
            setTestResult({
                success: false,
                message: errorMessage
            });
        } finally {
            setTestLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;



        const data = new FormData();
        data.append('profile_photo', file);

        setUploading(true);
        try {
            const response = await api.put('/auth/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(response.data.user);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Upload failed', error);
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (!user?.profile_photo) return;

        setUploading(true);
        try {
            await api.put('/auth/profile', { remove_photo: true });
            setUser({ ...user, profile_photo: null });
        } catch (error) {
            console.error('Remove failed', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const response = await api.put('/auth/profile', formData);
            setUser(response.data.user);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getProfilePhotoUrl = (photoPath) => {
        if (!photoPath) return null;
        if (photoPath.startsWith('http')) return photoPath;
        return `${BACKEND_ORIGIN}/${photoPath}`;
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 leading-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account profile and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <User size={18} className="text-blue-500" />
                                Profile Information
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-200 flex items-center justify-center">
                                        {user?.profile_photo ? (
                                            <img src={getProfilePhotoUrl(user.profile_photo)} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                <User size={40} />
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center rounded-2xl">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="text-center md:text-left">
                                    <h4 className="font-bold text-slate-900 text-lg">Profile Photo</h4>
                                    <p className="text-sm text-slate-500 mt-1">Upload a JPG or PNG image</p>
                                    <div className="mt-3 flex gap-2 justify-center md:justify-start">
                                        <button
                                            type="button"
                                            className="text-sm font-bold text-blue-600 hover:text-blue-500"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {uploading ? 'Uploading...' : 'Change'}
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm font-bold text-red-500 hover:text-red-400"
                                            onClick={handleRemovePhoto}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Company Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.company_name}
                                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Bio / Description</label>
                                <textarea
                                    rows="4"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none shadow-inner"
                                    placeholder="Tell us about yourself..."
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <Shield size={16} className="text-green-500" />
                                    Your data is protected and encrypted.
                                </p>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                                    {success && <Check size={18} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Smartphone size={32} className="text-blue-600" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Connect WhatsApp</h4>
                        <p className="text-sm text-slate-500 mb-6">Link your WhatsApp Business Account to start sending messages.</p>
                        <button
                            onClick={() => setShowConnectModal(true)}
                            className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                        >
                            Connect API
                        </button>

                        <div className="mt-5 pt-5 border-t border-slate-100 space-y-3 text-left">
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Test WhatsApp Send</p>
                            <input
                                type="text"
                                value={testPhone}
                                onChange={(e) => setTestPhone(e.target.value)}
                                placeholder="e.g. 919159039389"
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button
                                onClick={handleWhatsAppTest}
                                disabled={testLoading}
                                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all disabled:opacity-60"
                            >
                                {testLoading ? 'Testing...' : 'Send Test Template'}
                            </button>
                            {testResult && (
                                <p className={`text-xs font-medium ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                                    {testResult.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <h4 className="font-bold text-lg mb-2 relative">Security Tips</h4>
                        <ul className="space-y-3 relative">
                            <li className="text-xs text-slate-400 flex items-start gap-2">
                                <Key size={14} className="text-blue-400 mt-0.5" />
                                Never share your JWT token or WhatsApp API keys with anyone.
                            </li>
                            <li className="text-xs text-slate-400 flex items-start gap-2">
                                <Shield size={14} className="text-blue-400 mt-0.5" />
                                Enable 2FA on your Meta Business account for extra safety.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showConnectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-900">Connect WhatsApp</h3>
                                <button
                                    onClick={() => setShowConnectModal(false)}
                                    className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 text-center space-y-6">
                                <div className="w-48 h-48 bg-white border-8 border-slate-50 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                                    <QrCode size={120} className="text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg text-slate-900">Scan QR Code</h4>
                                    <p className="text-sm text-slate-500">Open WhatsApp on your phone, go to Linked Devices and scan this code to connect your account.</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3 text-left">
                                    <Smartphone className="text-blue-600 shrink-0" size={20} />
                                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                        Scan will expire in 2 minutes. Make sure your phone is connected to the internet.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowConnectModal(false)}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Settings;
