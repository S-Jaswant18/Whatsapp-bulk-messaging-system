import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Send,
  Bot,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BACKEND_ORIGIN } from '../config/runtime';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Chat', icon: MessageSquare, path: '/chat' },
    { name: 'Campaigns', icon: Send, path: '/campaigns' },
    { name: 'Automation', icon: Bot, path: '/automation' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    return `${BACKEND_ORIGIN}/${photoPath}`;
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-white border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Send size={20} className="text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">WhatsApp SaaS</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
              isActive
                ? "bg-blue-600/10 text-blue-500 font-medium"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors duration-200",
              "group-hover:text-current"
            )} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
            {user?.profile_photo ? (
              <img src={getProfilePhotoUrl(user.profile_photo)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Users size={20} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
