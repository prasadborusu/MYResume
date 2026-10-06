import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home,
  FileText, 
  Palette, 
  User, 
  Settings, 
  LogOut, 
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { profile, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, end: true },
    { name: 'Templates', path: '/templates', icon: Palette, end: false },
    { name: 'Profile', path: '/profile', icon: User, end: false },
    { name: 'Settings', path: '/settings', icon: Settings, end: false },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Compact Minimal Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#0B0B0D] border-r border-zinc-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-800/80">
            <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-md shadow-white/10 font-bold">
                <FileText className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                My Resume
              </span>
            </NavLink>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Minimal Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name + index}
                  to={item.path}
                  onClick={onClose}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-800/90 text-white border border-zinc-700/80 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Compact User Profile & Logout */}
        <div className="p-3 border-t border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-[#141417] border border-zinc-800/80">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 font-bold text-xs">
              {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {user?.email || profile?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
