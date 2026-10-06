import React from 'react';
import { LanguageItem } from '../../types/resume';
import { Plus, Trash2, Languages as LangIcon } from 'lucide-react';

interface LanguagesFormProps {
  data: LanguageItem[];
  onChange: (data: LanguageItem[]) => void;
}

const PROFICIENCIES: LanguageItem['proficiency'][] = [
  'Native',
  'Fluent',
  'Professional',
  'Intermediate',
  'Basic'
];

export const LanguagesForm: React.FC<LanguagesFormProps> = ({ data, onChange }) => {
  const handleAdd = () => {
    const newItem: LanguageItem = {
      id: 'lang_' + Math.random().toString(36).substring(2, 9),
      language: '',
      proficiency: 'Fluent',
    };
    onChange([...data, newItem]);
  };

  const handleUpdate = (id: string, field: keyof LanguageItem, value: any) => {
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
          <LangIcon className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No languages added yet</p>
          <p className="text-xs text-zinc-500 mt-1">Add languages and your proficiency levels.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item.id} className="bg-[#141417] border border-zinc-800 rounded-xl p-3 flex items-center gap-2">
            <input
              type="text"
              value={item.language}
              onChange={(e) => handleUpdate(item.id, 'language', e.target.value)}
              placeholder="Enter language name (e.g. English, Telugu, Hindi)"
              className="flex-1 bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
            <select
              value={item.proficiency}
              onChange={(e) => handleUpdate(item.id, 'proficiency', e.target.value)}
              className="bg-[#09090B] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
            >
              {PROFICIENCIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Remove language"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-zinc-800 bg-[#141417] text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/80 text-xs font-semibold transition-all"
      >
        <Plus className="w-3.5 h-3.5 text-zinc-300" /> Add Language
      </button>
    </div>
  );
};
