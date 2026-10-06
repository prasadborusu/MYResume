import React from 'react';
import { CertificationItem } from '../../types/resume';
import { Plus, Trash2, Award, ExternalLink } from 'lucide-react';

interface CertificationsFormProps {
  data: CertificationItem[];
  onChange: (data: CertificationItem[]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
  const handleAdd = () => {
    const newItem: CertificationItem = {
      id: 'cert_' + Math.random().toString(36).substring(2, 9),
      name: '',
      issuer: '',
      date: '',
      credentialUrl: '',
    };
    onChange([...data, newItem]);
  };

  const handleUpdate = (id: string, field: keyof CertificationItem, value: string) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {data.length === 0 && (
        <div className="text-center py-6 px-4 bg-[#141417] border border-dashed border-zinc-800 rounded-xl">
          <Award className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No certifications added yet</p>
          <p className="text-xs text-zinc-500 mt-1">Add AWS, Google, Coursera, Meta, or industry credentials.</p>
        </div>
      )}

      {data.map((item, index) => (
        <div key={item.id} className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3 relative">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-300">
              Certification #{index + 1} {item.name ? `— ${item.name}` : ''}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="p-1 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Certification Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                placeholder="Enter certification name"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Issuing Organization <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={item.issuer}
                onChange={(e) => handleUpdate(item.id, 'issuer', e.target.value)}
                placeholder="Enter issuing organization (e.g. AWS, Coursera, Google)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Issue Date / Year
              </label>
              <input
                type="text"
                value={item.date}
                onChange={(e) => handleUpdate(item.id, 'date', e.target.value)}
                placeholder="Enter issue date / year (e.g. 2024)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" /> Credential URL / ID
              </label>
              <input
                type="text"
                value={item.credentialUrl}
                onChange={(e) => handleUpdate(item.id, 'credentialUrl', e.target.value)}
                placeholder="Enter credential URL / certificate ID"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#141417] text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/80 text-sm font-semibold transition-all"
      >
        <Plus className="w-4 h-4 text-zinc-300" /> Add Certification
      </button>
    </div>
  );
};
