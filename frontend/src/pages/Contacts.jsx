import React, { useState, useEffect } from 'react';
import {
  Plus,
  Upload,
  Search,
  MoreVertical,
  Trash2,
  Filter,
  Users as UsersIcon
} from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', group_name: '' });
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contacts', newContact);
      setShowAddModal(false);
      setNewContact({ name: '', phone: '', group_name: '' });
      fetchContacts();
    } catch (error) {
      console.error('Add failed', error);
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/contacts/upload', formData);
      fetchContacts();
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 mt-1">Manage your subscribers and groups.</p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Upload size={18} />
            <span>Import CSV</span>
            <input type="file" className="hidden" accept=".csv" onChange={handleCsvUpload} />
          </label>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
          >
            <Plus size={20} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              showFilter ? "bg-blue-600 text-white" : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
            )}
          >
            <Filter size={16} />
            Filter
          </button>
        </div>

        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 border-b border-slate-100 bg-slate-50/30 overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 items-center py-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Filters:</span>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors">Has Bio</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors">VIP Group</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors">Added This Week</button>
                <div className="flex-1"></div>
                <button
                  onClick={() => setSearch('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Added On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {contact.name[0]}
                      </div>
                      <span className="font-semibold text-slate-900">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                      {contact.group_name || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">+{contact.phone}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredContacts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <UsersIcon size={48} className="text-slate-200 mb-4" />
                      <p className="text-lg font-semibold">No contacts found</p>
                      <p className="text-sm">Start by adding your first contact or importing a CSV.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">Add New Contact</h3>
              </div>
              <form onSubmit={handleAddContact} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number (with country code)</label>
                  <input
                    type="text"
                    required
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="1234567890"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Group Name</label>
                  <input
                    type="text"
                    value={newContact.group_name}
                    onChange={(e) => setNewContact({ ...newContact, group_name: e.target.value })}
                    placeholder="VIP Customers"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
                  >
                    Save Contact
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

export default Contacts;
