import React from 'react';
import {
    MessageSquare,
    Users,
    Send,
    CheckCircle2,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityLog = () => {
    const navigate = useNavigate();

    const activities = [
        { id: 1, type: 'campaign', title: 'Summer Sale 2024 Started', time: '2 mins ago', icon: Send, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 2, type: 'contact', title: 'Imported 500 contacts via CSV', time: '1 hour ago', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 3, type: 'message', title: 'New incoming message from +1234567890', time: '3 hours ago', icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50' },
        { id: 4, type: 'system', title: 'API Connection Stabilized', time: '5 hours ago', icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-50' },
        { id: 5, type: 'campaign', title: 'Marketing Template v2 Created', time: '1 day ago', icon: Send, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 6, type: 'error', title: 'Campaign "Test" Failed - Invalid Template', time: '1 day ago', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Activity Log</h1>
                    <p className="text-slate-500">A detailed history of all system events and operations.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {activities.map((activity) => (
                        <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors group">
                            <div className={`p-3 rounded-xl ${activity.bg}`}>
                                <activity.icon size={22} className={activity.color} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{activity.title}</h4>
                                <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold text-[10px]">{activity.type}</p>
                            </div>
                            <span className="text-sm text-slate-400 font-medium">{activity.time}</span>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 font-medium">Showing latest 20 activities</p>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
