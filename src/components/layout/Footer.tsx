import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, FileCheck, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#09090B] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black">
                <FileText className="w-4 h-4 text-black" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">My Resume</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Build your professional resume easily. Modern, ATS-friendly templates designed for students, freshers, and professionals.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/templates" className="hover:text-white transition-colors">Resume Templates</Link></li>
              <li><Link to="/resume/new" className="hover:text-white transition-colors">Resume Builder</Link></li>
              <li><a href="/#features" className="hover:text-white transition-colors">Smart Content Generator</a></li>
              <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">My Resumes</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/settings" className="hover:text-white transition-colors">Account Settings</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Legal & Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-zinc-300" /> <span>Row Level Security</span></li>
              <li className="flex items-center gap-1.5"><FileCheck className="w-3.5 h-3.5 text-emerald-400" /> <span>ATS Optimized</span></li>
              <li><span className="text-zinc-500">Privacy Policy • Terms of Service</span></li>
              <li className="flex items-center gap-1.5 text-zinc-500"><Mail className="w-3.5 h-3.5" /> <span>support@myresume.app</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} My Resume. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for students & job seekers with precision.
          </p>
        </div>
      </div>
    </footer>
  );
};
