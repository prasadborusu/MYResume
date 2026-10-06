import React from 'react';
import { ProjectItem } from '../../types/resume';
import { Plus, Trash2, FolderGit2, Sparkles, RefreshCw, Wand2, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import { generateProjectDescription, improveProjectDescription } from '../../generators/project';
import { useToast } from '../../context/ToastContext';

interface ProjectsFormProps {
  data: ProjectItem[];
  onChange: (data: ProjectItem[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const { showToast } = useToast();

  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name: '',
      role: '',
      technologies: '',
      description: '',
      projectUrl: '',
      githubUrl: '',
    };
    onChange([...data, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ProjectItem, value: string) => {
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

  const handleGenerate = (item: ProjectItem) => {
    const res = generateProjectDescription({
      name: item.name,
      role: item.role,
      technologies: item.technologies,
    });
    handleUpdate(item.id, 'description', res.text);
    showToast(`Smart description generated for "${item.name || 'Project'}"!`, 'success');
  };

  const handleImprove = (item: ProjectItem) => {
    if (!item.description?.trim()) {
      handleGenerate(item);
      return;
    }
    const improved = improveProjectDescription(item.description, {
      name: item.name,
      role: item.role,
      technologies: item.technologies,
    });
    handleUpdate(item.id, 'description', improved);
    showToast(`Description polished with action verbs!`, 'success');
  };

  return (
    <div className="space-y-4">
      {data.length === 0 && (
        <div className="text-center py-6 px-4 bg-[#141417] border border-dashed border-zinc-800 rounded-xl">
          <FolderGit2 className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">No projects added yet</p>
          <p className="text-xs text-zinc-500 mt-1">Showcase your portfolio applications, open-source work, or capstone projects.</p>
        </div>
      )}

      {data.map((item, index) => (
        <div key={item.id} className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3.5 relative">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-200">
              Project #{index + 1} {item.name ? `— ${item.name}` : ''}
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
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                placeholder="Enter project name"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Your Role
              </label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => handleUpdate(item.id, 'role', e.target.value)}
                placeholder="Enter your role (e.g. Lead Developer / Creator)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Technologies Used (comma separated)
              </label>
              <input
                type="text"
                value={item.technologies}
                onChange={(e) => handleUpdate(item.id, 'technologies', e.target.value)}
                placeholder="Enter technologies used (e.g. React, Python, PostgreSQL)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <GithubIcon className="w-3.5 h-3.5 text-zinc-400" /> GitHub Repository URL
              </label>
              <input
                type="text"
                value={item.githubUrl}
                onChange={(e) => handleUpdate(item.id, 'githubUrl', e.target.value)}
                placeholder="Enter GitHub repository URL"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" /> Live Demo URL
              </label>
              <input
                type="text"
                value={item.projectUrl}
                onChange={(e) => handleUpdate(item.id, 'projectUrl', e.target.value)}
                placeholder="Enter live demo URL (optional)"
                className="w-full bg-[#09090B] border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Project Bullet Points / Description
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
              placeholder="• Enter key achievements and impact of this project&#10;• You can click Generate to automatically create professional bullet points"
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
        <Plus className="w-4 h-4 text-white" /> Add Project
      </button>
    </div>
  );
};
