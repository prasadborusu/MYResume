import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Settings, KeyRound, LogOut, ShieldAlert, CheckCircle2, User, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, profile, logout, resetPasswordRequest } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsResettingPassword(true);

    try {
      const res = await resetPasswordRequest(user.email);
      if (res.success) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (e: any) {
      showToast('Failed to request password reset.', 'error');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  const handleClearLocalData = () => {
    if (window.confirm('Are you sure you want to reset local storage caches? Your cloud resumes on Supabase will remain safe.')) {
      localStorage.removeItem('my_resumes_store');
      showToast('Local cache refreshed.', 'info');
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage your account preferences and security credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Info Card */}
        <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <User className="w-4 h-4 text-zinc-300" />
            <h2 className="text-sm font-bold text-white">Account Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Full Name</span>
              <p className="text-zinc-200 font-semibold">{profile?.full_name || 'My Resume User'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Email Address</span>
              <p className="text-zinc-200 font-semibold">{user?.email || profile?.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">User Identifier</span>
              <p className="text-zinc-400 font-mono text-[11px] truncate">{user?.id}</p>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Account Status</span>
              <p className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
              </p>
            </div>
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <KeyRound className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Security & Password</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-zinc-200">Reset Account Password</p>
              <p className="text-xs text-zinc-400">Receive an email with a secure link to update your password.</p>
            </div>

            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={isResettingPassword}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors shrink-0"
            >
              {isResettingPassword ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </div>

        {/* Data & Storage Management Card */}
        <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Database className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Storage & Local Data</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-zinc-200">Reset Local Browser Cache</p>
              <p className="text-xs text-zinc-400">Clears offline temporary drafts if you experience state inconsistencies.</p>
            </div>

            <button
              type="button"
              onClick={handleClearLocalData}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors shrink-0"
            >
              Clear Cache
            </button>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="bg-[#141417] border border-rose-950/40 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-rose-300">Sign Out of My Resume</p>
            <p className="text-xs text-zinc-400">Safely terminate your active session on this device.</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-semibold transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
