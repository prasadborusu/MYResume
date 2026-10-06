import React from 'react';
import { AchievementItem } from '../../types/resume';
import { Plus, Trash2, Trophy, Sparkles, Wand2 } from 'lucide-react';
import { generateAchievement, improveAchievement } from '../../generators/achievement';
import { useToast } from '../../context/ToastContext';

interface AchievementsFormProps {
  data: AchievementItem[];
  onChange: (data: AchievementItem[]) => void;
}

export const AchievementsForm: React.FC<AchievementsFormProps> = ({ data, onChange }) => {
  const { showToast } = useToast();

  const handleAdd = () => {
    const newItem: AchievementItem = {
      id: 'ach_' + Math.random().toString(36).substring(2, 9),
      title: '',
      description: '',
    };
    onChange([...data, newItem]);
  };

  const handleUpdate = (id: string, field: keyof AchievementItem, value: string) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const handleGenerate = (item: AchievementItem) => {
    const res = generateAchievement({
      title: item.title,
    });
    handleUpdate(item.id, 'description', res.text);
    showToast('Achievement description generated!', 'success');
  };

  const handleImprove = (item: AchievementItem) => {
    if (!item.description?.trim()) {
      handleGenerate(item);
      return;
    }
    const improved = improveAchievement(item.description, { title: item.title });
    handleUpdate(item.id, 'description', improved);
    showToast('Achievement wording refined!', 'success');
  };

  return (
    <div className="space-y-4">
      {data.length === 0 && (
        <div className="text-center py-6 px-4 bg-[#141417] border border-dashed border-zinc-800 rounded-xl">
          <Trophy className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No key achievements added yet</p>
          <p className="text-xs text-zinc-500 mt-1">Add hackathons, competition rankings, scholarships, or publications.</p>
        </div>
      )}

      {data.map((item, index) => (
        <div key={item.id} className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3 relative">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-300">
              Achievement #{index + 1}
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

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Achievement / Award Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
              placeholder="Enter achievement / award title"
              className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-zinc-300">
                Description / Context
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleGenerate(item)}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-zinc-300" /> Generate
                </button>
                <button
                  type="button"
                  onClick={() => handleImprove(item)}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                >
                  <Wand2 className="w-3 h-3 text-zinc-300" /> Improve
                </button>
              </div>
            </div>
            <textarea
              rows={2}
              value={item.description}
              onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
              placeholder="Enter details about this achievement or award..."
              className="w-full bg-[#09090B] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#141417] text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/80 text-sm font-semibold transition-all"
      >
        <Plus className="w-4 h-4 text-zinc-300" /> Add Achievement
      </button>
    </div>
  );
};
