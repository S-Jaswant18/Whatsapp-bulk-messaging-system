import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Users,
  Send,
  CheckCircle2,
  MessageSquare,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalContacts, setTotalContacts] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchActivities();
    fetchContacts();

    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
    const socket = io(baseUrl);

    socket.on('dashboard_update', () => {
      fetchStats();
      fetchActivities();
    });

    return () => socket.close();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/campaigns/analytics');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await api.get('/messages/logs');
      setActivities(response.data.data);
    } catch (error) {
      console.error('Failed to fetch activities', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setTotalContacts(response.data.length);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    }
  };

  const getStatCount = (status) => {
    const stat = stats.find(s => s.status === status);
    return stat ? stat._count : 0;
  };

  const totalSent = stats.reduce((acc, curr) => acc + curr._count, 0);

  const cards = [
    { name: 'Total Contacts', value: totalContacts, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Sent Messages', value: totalSent, icon: Send, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Delivered', value: getStatCount('delivered'), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Failed', value: getStatCount('failed'), icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const chartData = [
    { name: 'Sent', value: getStatCount('sent'), color: '#3b82f6' },
    { name: 'Delivered', value: getStatCount('delivered'), color: '#10b981' },
    { name: 'Read', value: getStatCount('read'), color: '#8b5cf6' },
    { name: 'Failed', value: getStatCount('failed'), color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">Overview</h1>
        <p className="text-slate-500 mt-1">Track your campaign performance and delivery rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={card.color} size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} />
                +12%
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{card.name}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Delivery Performance</h2>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full ${activity.is_incoming ? 'bg-blue-100' : 'bg-slate-100'} flex items-center justify-center shrink-0`}>
                    <MessageSquare size={18} className={activity.is_incoming ? 'text-blue-600' : 'text-slate-600'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.is_incoming ? 'Received Message' : 'Sent Message'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activity.contact?.name || activity.contact?.phone || 'Unknown'} • {new Date(activity.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${activity.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      activity.status === 'read' ? 'bg-blue-100 text-blue-700' :
                        activity.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                      }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">No recent activity</p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/activity')}
            className="w-full mt-8 py-2.5 text-blue-600 text-sm font-semibold hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
          >
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
