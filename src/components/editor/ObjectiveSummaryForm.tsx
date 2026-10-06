import React from 'react';
import { Sparkles, RefreshCw, Wand2, FileText, Target } from 'lucide-react';
import { generateObjective, improveObjective } from '../../generators/objective';
import { generateSummary, improveSummary } from '../../generators/summary';
import { useToast } from '../../context/ToastContext';

interface ObjectiveSummaryFormProps {
  objective: string;
  summary: string;
  jobTitle?: string;
  skills?: { name: string }[];
  onObjectiveChange: (val: string) => void;
  onSummaryChange: (val: string) => void;
}

export const ObjectiveSummaryForm: React.FC<ObjectiveSummaryFormProps> = ({
  objective,
  summary,
  jobTitle,
  skills,
  onObjectiveChange,
  onSummaryChange,
}) => {
  const { showToast } = useToast();

  const skillNames = skills?.map((s) => s.name) || [];

  // Objective Handlers
  const handleGenerateObjective = () => {
    const res = generateObjective({
      role: jobTitle || 'Software Professional',
      skills: skillNames,
    });
    onObjectiveChange(res.text);
    showToast('Career Objective generated!', 'success');
  };

  const handleImproveObjective = () => {
    if (!objective.trim()) {
      handleGenerateObjective();
      return;
    }
    const improved = improveObjective(objective, jobTitle);
    onObjectiveChange(improved);
    showToast('Career Objective improved with strong action keywords!', 'success');
  };

  // Summary Handlers
  const handleGenerateSummary = () => {
    const res = generateSummary({
      role: jobTitle || 'Software Engineer',
      topSkills: skillNames,
    });
    onSummaryChange(res.text);
    showToast('Professional Summary generated!', 'success');
  };

  const handleImproveSummary = () => {
    if (!summary.trim()) {
      handleGenerateSummary();
      return;
    }
    const improved = improveSummary(summary, jobTitle);
    onSummaryChange(improved);
    showToast('Professional Summary enhanced with polished impact statements!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Career Objective Section */}
      <div className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-300" />
            <span className="text-sm font-semibold text-zinc-100">Career Objective</span>
            <span className="text-xs text-zinc-500">(Ideal for Freshers & Entry-Level)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleGenerateObjective}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
              title="Generate tailored objective"
            >
              <Sparkles className="w-3 h-3 text-black" /> Generate
            </button>
            <button
              type="button"
              onClick={handleGenerateObjective}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
              title="Regenerate alternative wording"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
            <button
              type="button"
              onClick={handleImproveObjective}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              title="Improve current text"
            >
              <Wand2 className="w-3 h-3 text-zinc-400" /> Improve
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={objective}
          onChange={(e) => onObjectiveChange(e.target.value)}
          placeholder="Enter your career objective (or click Generate to create one automatically)"
          className="w-full bg-[#09090B] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors leading-relaxed"
        />
      </div>

      {/* Professional Summary Section */}
      <div className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-300" />
            <span className="text-sm font-semibold text-zinc-100">Professional Summary</span>
            <span className="text-xs text-zinc-500">(Recommended for Experienced Candidates)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleGenerateSummary}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
              title="Generate summary"
            >
              <Sparkles className="w-3 h-3 text-black" /> Generate
            </button>
            <button
              type="button"
              onClick={handleGenerateSummary}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
              title="Regenerate alternative summary"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
            <button
              type="button"
              onClick={handleImproveSummary}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              title="Enhance current summary"
            >
              <Wand2 className="w-3 h-3 text-zinc-400" /> Improve
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Enter your professional summary (or click Generate to create one automatically)"
          className="w-full bg-[#09090B] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors leading-relaxed"
        />
      </div>
    </div>
  );
};
