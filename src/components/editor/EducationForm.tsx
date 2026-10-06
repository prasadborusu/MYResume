import React from 'react';
import { EducationItem } from '../../types/resume';
import { Plus, Trash2, GraduationCap, ChevronUp, ChevronDown } from 'lucide-react';

interface EducationFormProps {
  data: EducationItem[];
  onChange: (data: EducationItem[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const handleAdd = () => {
    const newItem: EducationItem = {
      id: 'edu_' + Math.random().toString(36).substring(2, 9),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      grade: '',
      description: '',
    };
    onChange([...data, newItem]);
  };

  const handleUpdate = (id: string, field: keyof EducationItem, value: string) => {
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

  return (
    <div className="space-y-4">
      {data.length === 0 && (
        <div className="text-center py-6 px-4 bg-[#141417] border border-dashed border-zinc-800 rounded-xl">
          <GraduationCap className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No education added yet</p>
          <p className="text-xs text-zinc-500 mt-1">Add your degrees, universities, or academic qualifications.</p>
        </div>
      )}

      {data.map((item, index) => (
        <div key={item.id} className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3.5 relative">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-300">
              Education #{index + 1} {item.institution ? `— ${item.institution}` : ''}
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
                title="Delete education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Institution / University <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={item.institution}
                onChange={(e) => handleUpdate(item.id, 'institution', e.target.value)}
                placeholder="Enter college / university name"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Degree <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={item.degree}
                onChange={(e) => handleUpdate(item.id, 'degree', e.target.value)}
                placeholder="Enter degree / qualification (e.g. Bachelor of Technology)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={item.fieldOfStudy}
                onChange={(e) => handleUpdate(item.id, 'fieldOfStudy', e.target.value)}
                placeholder="Enter field of study / branch (e.g. Computer Science)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Grade / CGPA
              </label>
              <input
                type="text"
                value={item.grade}
                onChange={(e) => handleUpdate(item.id, 'grade', e.target.value)}
                placeholder="Enter grade / CGPA / percentage (e.g. 8.5 CGPA or 85%)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Start Year
              </label>
              <input
                type="text"
                value={item.startYear}
                onChange={(e) => handleUpdate(item.id, 'startYear', e.target.value)}
                placeholder="Enter start year (e.g. 2020)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                End Year (or Expected)
              </label>
              <input
                type="text"
                value={item.endYear}
                onChange={(e) => handleUpdate(item.id, 'endYear', e.target.value)}
                placeholder="Enter end year (e.g. 2024)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Description / Honors / Activities
            </label>
            <textarea
              rows={2}
              value={item.description}
              onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
              placeholder="Enter relevant coursework, honors, or academic achievements..."
              className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#141417] text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/80 text-sm font-semibold transition-all"
      >
        <Plus className="w-4 h-4 text-zinc-300" /> Add Education
      </button>
    </div>
  );
};
