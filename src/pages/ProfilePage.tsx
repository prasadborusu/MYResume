import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, MapPin, Globe, Save, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/Icons';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, user } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setLinkedin(profile.linkedin || '');
      setGithub(profile.github || '');
      setPortfolio(profile.portfolio || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        location: location.trim(),
        linkedin: linkedin.trim(),
        github: github.trim(),
        portfolio: portfolio.trim(),
      });

      if (res.success) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Top Title */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Your Profile</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage your default personal contact information across all resumes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#141417] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" /> Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-[#09090B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Email (Read only auth email) */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" /> Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || profile?.email || ''}
              className="w-full bg-[#09090B]/60 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">Managed by Supabase Auth</span>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full bg-[#09090B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Location (City, Country)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location (e.g. Hyderabad, India)"
              className="w-full bg-[#09090B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <LinkedinIcon className="w-3.5 h-3.5 text-zinc-400" /> LinkedIn
            </label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="Enter your LinkedIn profile URL"
              className="w-full bg-[#09090B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <GithubIcon className="w-3.5 h-3.5 text-zinc-400" /> GitHub
            </label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="Enter your GitHub profile URL"
              className="w-full bg-[#09090B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Portfolio */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-400" /> Portfolio / Website
            </label>
            <input
              type="text"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="Enter your portfolio / website URL"
              className="w-full bg-[#09090B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-50 text-black text-xs font-semibold shadow-sm transition-all"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-black" />
            )}
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
