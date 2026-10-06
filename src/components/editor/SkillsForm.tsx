import React, { useState } from 'react';
import { SkillItem } from '../../types/resume';
import { Plus, X, Wrench } from 'lucide-react';

interface SkillsFormProps {
  data: SkillItem[];
  onChange: (data: SkillItem[]) => void;
}

const CATEGORIES: SkillItem['category'][] = [
  'Programming Languages',
  'Frameworks',
  'Tools',
  'Databases',
  'Other Skills'
];

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillItem['category']>('Programming Languages');

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkillName.trim()) return;

    // Support comma-separated batch adding: e.g. "React, TypeScript, Next.js"
    const names = newSkillName.split(',').map((n) => n.trim()).filter(Boolean);
    const newItems: SkillItem[] = names.map((name) => ({
      id: 'sk_' + Math.random().toString(36).substring(2, 9),
      name,
      category: selectedCategory,
      level: 'Advanced'
    }));

    onChange([...data, ...newItems]);
    setNewSkillName('');
  };

  const handleDelete = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: data.filter((s) => s.category === cat)
  }));

  return (
    <div className="space-y-5">
      {/* Add Skill Input Card */}
      <div className="bg-[#141417] border border-zinc-800 rounded-xl p-4 space-y-3">
        <label className="block text-xs font-semibold text-zinc-200">
          Add New Skills (comma separated or single)
        </label>
        
        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as SkillItem['category'])}
            className="bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 shrink-0"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Enter skill name (e.g. Python, React, SQL)"
            className="flex-1 bg-[#09090B] border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />

          <button
            type="submit"
            disabled={!newSkillName.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-200 disabled:opacity-40 text-black text-xs font-semibold rounded-lg transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 border-t border-zinc-800/60">
          <span className="text-[11px] text-zinc-500 mr-2">Popular quick adds:</span>
          <div className="inline-flex flex-wrap gap-1 mt-1">
            {['TypeScript', 'React', 'Python', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'Tailwind CSS'].map((preset) => {
              const alreadyHas = data.some((s) => s.name.toLowerCase() === preset.toLowerCase());
              if (alreadyHas) return null;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange([...data, {
                      id: 'sk_' + Math.random().toString(36).substring(2, 9),
                      name: preset,
                      category: selectedCategory,
                      level: 'Advanced'
                    }]);
                  }}
                  className="px-2 py-0.5 text-[11px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded border border-zinc-700/50 transition-colors"
                >
                  + {preset}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grouped Skills Display */}
      {data.length === 0 ? (
        <div className="text-center py-6 px-4 bg-[#141417] border border-dashed border-zinc-800 rounded-xl">
          <Wrench className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No skills added yet</p>
          <p className="text-xs text-zinc-500 mt-1">Add programming languages, frameworks, databases, and tools.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map(({ category, items }) => {
            if (items.length === 0) return null;
            return (
              <div key={category} className="bg-[#141417] border border-zinc-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-300">{category}</span>
                  <span className="text-zinc-500">{items.length} skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700/70 rounded-lg text-xs text-zinc-200"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(skill.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
