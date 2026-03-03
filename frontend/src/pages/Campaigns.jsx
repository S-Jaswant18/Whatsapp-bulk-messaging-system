import React, { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Clock,
  Calendar,
  Layout,
  Users,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  MoreVertical,
  X,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    template_name: '',
    group_name: '',
    scheduled_time: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/campaigns', newCampaign);
      setShowAddModal(false);
      fetchCampaigns();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700 animate-pulse';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-500 mt-1">Send bulk messages and track delivery status.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
        >
          <Plus size={20} />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className="flex items-start justify-between mb-4">
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(camp.status)}`}>
                {camp.status}
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={18} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{camp.name}</h3>

            <div className="space-y-3 mt-2 flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Layout size={16} className="text-slate-400" />
                <span>Template: <span className="text-slate-900 font-semibold">{camp.template_name}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Users size={16} className="text-slate-400" />
                <span>Contacts: <span className="text-slate-900 font-semibold">{camp._count?.messages || 0}</span></span>
              </div>
              {camp.scheduled_time && (
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Clock size={16} className="text-slate-400" />
                  <span>Scheduled: <span className="text-slate-900 font-semibold">{new Date(camp.scheduled_time).toLocaleString()}</span></span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-400">Created {new Date(camp.created_at).toLocaleDateString()}</div>
              <button
                onClick={() => setSelectedCampaign(camp)}
                className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                View Details
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
        {!loading && campaigns.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                <Send size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No campaigns yet</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-6">Create your first bulk messaging campaign to reach out to your contacts instantly.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-blue-600 font-bold hover:underline"
              >
                Create Campaign
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedCampaign.name}</h3>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Campaign Statistics</p>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Send size={16} />
                      <span className="text-xs font-bold uppercase">Sent</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{selectedCampaign._count?.messages || 0}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <CheckCircle2 size={16} />
                      <span className="text-xs font-bold uppercase">Delivered</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 size={18} className="text-blue-500" />
                    Delivery Funnel
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Sent', value: '100%', color: 'bg-blue-500' },
                      { label: 'Delivered', value: '0%', color: 'bg-green-500' },
                      { label: 'Read', value: '0%', color: 'bg-purple-500' },
                      { label: 'Failed', value: '0%', color: 'bg-red-500' },
                    ].map((bar) => (
                      <div key={bar.label} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>{bar.label}</span>
                          <span>{bar.value}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${bar.color} transition-all duration-1000`} style={{ width: bar.value }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <AlertCircle className="text-slate-400 shrink-0" size={20} />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Detailed reports and message-level logs are available in the <span className="text-blue-600 font-bold">Analytics</span> section. This campaign used the <span className="font-bold text-slate-700">{selectedCampaign.template_name}</span> template.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">New Campaign</h3>
              </div>
              <form onSubmit={handleCreate} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="e.g. Summer Promo 2024"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Contact Group</label>
                    <input
                      type="text"
                      required
                      value={newCampaign.group_name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, group_name: e.target.value })}
                      placeholder="e.g. VIP Customers"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Meta Template Name</label>
                    <input
                      type="text"
                      required
                      value={newCampaign.template_name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, template_name: e.target.value })}
                      placeholder="e.g. welcome_msg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Schedule Time (Optional)</label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={newCampaign.scheduled_time}
                      onChange={(e) => setNewCampaign({ ...newCampaign, scheduled_time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium cursor-pointer"
                    />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Start Campaign
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

export default Campaigns;
