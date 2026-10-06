import React from 'react';
import { ExperienceItem } from '../../types/resume';
import { Plus, Trash2, Briefcase, Sparkles, RefreshCw, Wand2, ChevronUp, ChevronDown } from 'lucide-react';
import { generateExperienceDescription, improveExperienceDescription } from '../../generators/experience';
import { useToast } from '../../context/ToastContext';

interface ExperienceFormProps {
  data: ExperienceItem[];
  onChange: (data: ExperienceItem[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const { showToast } = useToast();

  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: 'exp_' + Math.random().toString(36).substring(2, 9),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };
    onChange([...data, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.length) return;
    const items = [...data];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  const handleGenerate = (item: ExperienceItem) => {
    const res = generateExperienceDescription({
      position: item.position,
      company: item.company,
    });
    handleUpdate(item.id, 'description', res.text);
    showToast(`Work experience bullets generated for ${item.position || 'Role'}!`, 'success');
  };

  const handleImprove = (item: ExperienceItem) => {
    if (!item.description?.trim()) {
      handleGenerate(item);
      return;
    }
    const improved = improveExperienceDescription(item.description, {
      position: item.position,
      company: item.company,
    });
    handleUpdate(item.id, 'description', improved);
    showToast('Experience statements polished with high-impact action verbs!', 'success');
  };

  return (
    <div className="space-y-4">
      {data.length === 0 && (
        <div className="text-center py-6 px-4 bg-[#141417] border border-dashed border-zinc-800 rounded-xl">
          <Briefcase className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No experience added yet</p>
          <p className="text-xs text-zinc-500 mt-1">Add internships, full-time positions, or freelance work.</p>
        </div>
      )}

      {data.map((item, index) => (
        <div key={item.id} className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3.5 relative">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-200">
              Experience #{index + 1} {item.company ? `— ${item.company}` : ''}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors"
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 'down')}
                disabled={index === data.length - 1}
                className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors"
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-1 text-zinc-400 hover:text-rose-400 transition-colors ml-1"
                title="Delete experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Job Title / Position <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={item.position}
                onChange={(e) => handleUpdate(item.id, 'position', e.target.value)}
                placeholder="Enter job title / designation"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Company Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => handleUpdate(item.id, 'company', e.target.value)}
                placeholder="Enter company / organization name"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={item.location}
                onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                placeholder="Enter job location (e.g. Hyderabad / Remote)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isCurrent}
                  onChange={(e) => handleUpdate(item.id, 'isCurrent', e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-zinc-400"
                />
                Currently Working Here
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={item.startDate}
                onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                placeholder="Enter start date (e.g. Jun 2022)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                End Date
              </label>
              <input
                type="text"
                value={item.isCurrent ? 'Present' : item.endDate}
                disabled={item.isCurrent}
                onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                placeholder="Enter end date (e.g. Present or Dec 2023)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Description with Smart Generator */}
          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Key Responsibilities & Impact
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleGenerate(item)}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-black" /> Generate
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate(item)}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => handleImprove(item)}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <Wand2 className="w-3 h-3 text-zinc-400" /> Improve
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={item.description}
              onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
              placeholder="• Enter key accomplishments, technologies, and achievements&#10;• You can click Generate to automatically create professional bullet points"
              className="w-full bg-[#09090B] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 font-mono leading-relaxed"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#141417] text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800/80 text-sm font-medium transition-all"
      >
        <Plus className="w-4 h-4 text-white" /> Add Work Experience
      </button>
    </div>
  );
};
