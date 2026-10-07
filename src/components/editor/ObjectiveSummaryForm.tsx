import React, { useState } from 'react';
import { Sparkles, RefreshCw, Wand2, FileText, Target, Layers, Trash2 } from 'lucide-react';
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

type SelectionMode = 'objective' | 'summary' | 'both';

export const ObjectiveSummaryForm: React.FC<ObjectiveSummaryFormProps> = ({
  objective,
  summary,
  jobTitle,
  skills,
  onObjectiveChange,
  onSummaryChange,
}) => {
  const { showToast } = useToast();

  // Determine initial selection based on existing values
  const [mode, setMode] = useState<SelectionMode>(() => {
    if (objective && summary) return 'both';
    if (objective && !summary) return 'objective';
    return 'summary'; // default to summary or objective
  });

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
    <div className="space-y-5">
      {/* Option Selector Pill Header */}
      <div className="bg-[#141417] border border-zinc-800 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Choose What to Include on Your Resume
          </span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            Select one section based on your experience level
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Career Objective Option */}
          <button
            type="button"
            onClick={() => setMode('objective')}
            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
              mode === 'objective'
                ? 'bg-zinc-800/90 border-zinc-500 shadow-sm text-white'
                : 'bg-[#09090B] border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <div className={`p-1.5 rounded-md mt-0.5 ${mode === 'objective' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'}`}>
              <Target className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold flex items-center gap-1.5">
                Career Objective
                {mode === 'objective' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                Ideal for freshers, students & entry-level
              </p>
            </div>
          </button>

          {/* Professional Summary Option */}
          <button
            type="button"
            onClick={() => setMode('summary')}
            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
              mode === 'summary'
                ? 'bg-zinc-800/90 border-zinc-500 shadow-sm text-white'
                : 'bg-[#09090B] border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <div className={`p-1.5 rounded-md mt-0.5 ${mode === 'summary' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'}`}>
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold flex items-center gap-1.5">
                Professional Summary
                {mode === 'summary' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                Recommended for experienced professionals
              </p>
            </div>
          </button>

          {/* Both Option */}
          <button
            type="button"
            onClick={() => setMode('both')}
            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
              mode === 'both'
                ? 'bg-zinc-800/90 border-zinc-500 shadow-sm text-white'
                : 'bg-[#09090B] border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <div className={`p-1.5 rounded-md mt-0.5 ${mode === 'both' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'}`}>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold flex items-center gap-1.5">
                Include Both
                {mode === 'both' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                Show and edit both sections together
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Career Objective Section */}
      {(mode === 'objective' || mode === 'both') && (
        <div className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3 transition-all">
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
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors"
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
              {objective && (
                <button
                  type="button"
                  onClick={() => {
                    onObjectiveChange('');
                    showToast('Career Objective cleared', 'info');
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                  title="Clear objective"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={3}
            value={objective}
            onChange={(e) => onObjectiveChange(e.target.value)}
            placeholder="Enter your career objective (or click Generate to create one automatically)"
            className="w-full bg-[#09090B] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors leading-relaxed"
          />

          {mode === 'objective' && summary.trim().length > 0 && (
            <div className="flex items-center justify-between text-xs bg-zinc-900/80 border border-zinc-800/80 rounded-lg px-3 py-2 text-zinc-400">
              <span>⚠️ Professional Summary currently has text which may also render on your template.</span>
              <button
                type="button"
                onClick={() => {
                  onSummaryChange('');
                  showToast('Professional Summary cleared to use only Career Objective', 'info');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium underline ml-2 whitespace-nowrap"
              >
                Clear Summary
              </button>
            </div>
          )}
        </div>
      )}

      {/* Professional Summary Section */}
      {(mode === 'summary' || mode === 'both') && (
        <div className="bg-[#141417] border border-zinc-800 rounded-xl p-4.5 space-y-3 transition-all">
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
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors"
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
              {summary && (
                <button
                  type="button"
                  onClick={() => {
                    onSummaryChange('');
                    showToast('Professional Summary cleared', 'info');
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                  title="Clear summary"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={4}
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Enter your professional summary (or click Generate to create one automatically)"
            className="w-full bg-[#09090B] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors leading-relaxed"
          />

          {mode === 'summary' && objective.trim().length > 0 && (
            <div className="flex items-center justify-between text-xs bg-zinc-900/80 border border-zinc-800/80 rounded-lg px-3 py-2 text-zinc-400">
              <span>⚠️ Career Objective currently has text which may also render on your template.</span>
              <button
                type="button"
                onClick={() => {
                  onObjectiveChange('');
                  showToast('Career Objective cleared to use only Professional Summary', 'info');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium underline ml-2 whitespace-nowrap"
              >
                Clear Objective
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
