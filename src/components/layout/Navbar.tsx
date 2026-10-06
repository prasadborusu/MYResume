import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, ArrowRight, LayoutDashboard, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090B]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black shadow-md shadow-white/10 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              My Resume
            </span>
            <span className="text-[10px] text-zinc-400 -mt-1 hidden sm:inline">
              Professional Resume Builder
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Landing / Public) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <a href="/#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <Link to="/templates" className="hover:text-white transition-colors">
            Templates
          </Link>
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-sm font-medium text-zinc-200 hover:text-white transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-zinc-300" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/resume/new"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-sm font-semibold text-black shadow-sm transition-all hover:translate-y-[-1px]"
              >
                <span>+ Create Resume</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-sm font-semibold text-black shadow-sm transition-all hover:translate-y-[-1px]"
              >
                <span>Create Resume</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
