import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resumeService } from '../services/resumeService';
import { TEMPLATES } from '../templates/templateList';
import { TemplateId } from '../types/resume';
import { sampleResumeData } from '../utils/initialData';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { TemplateThumbnail } from '../components/resume/TemplateThumbnail';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Eye, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export const ResumeNew: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null);
  const [modalZoom, setModalZoom] = useState<number>(0.95);
  const [isCreating, setIsCreating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSelectTemplate = (id: TemplateId) => {
    setSelectedTemplate(id);
    setValidationError('');
  };

  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedTemplate) {
      setValidationError('Please select a template to continue.');
      showToast('Please select a template to continue.', 'warning');
      return;
    }

    if (!user) {
      showToast('Please sign in to create your resume.', 'info');
      navigate('/login');
      return;
    }

    setIsCreating(true);
    setValidationError('');

    try {
      const initialData = {
        personal: {
          fullName: profile?.full_name || '',
          jobTitle: '',
          email: user.email || profile?.email || '',
          phone: profile?.phone || '',
          location: profile?.location || '',
          linkedin: profile?.linkedin || '',
          github: profile?.github || '',
          portfolio: profile?.portfolio || ''
        },
        objective: '',
        summary: '',
        education: [],
        skills: [],
        projects: [],
        experience: [],
        certifications: [],
        achievements: [],
        languages: []
      };

      const newResume = await resumeService.createResume({
        userId: user.id,
        title: 'My Resume',
        templateId: selectedTemplate,
        initialData,
      });

      showToast(`Created new resume with ${selectedTemplate} template!`, 'success');
      navigate(`/resume/${newResume.id}/edit`);
    } catch (err: any) {
      console.error('Create resume error:', err);
      showToast('Unable to create your resume. Please try again.', 'error');
      setValidationError('Unable to create your resume. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const currentPreviewMeta = TEMPLATES.find((t) => t.id === previewTemplate);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose Your Resume Template
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Select a professional template for your resume. You can change your resume content later.
          </p>
        </div>

        {/* Quick selection indicator */}
        {selectedTemplate && (
          <div className="hidden sm:flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-3.5 py-1.5 rounded-xl text-xs text-zinc-200">
            <Check className="w-4 h-4 text-white" />
            <span>Selected: <strong className="text-white capitalize">{selectedTemplate}</strong></span>
          </div>
        )}
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-2.5 text-rose-300 text-xs shadow-md animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* 3-Column Responsive Template Grid with Full-Width Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;

          return (
            <div
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl.id)}
              className={`group cursor-pointer rounded-2xl bg-[#141417] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card hover:translate-y-[-2px] ${
                isSelected
                  ? 'border-white ring-2 ring-white/30 shadow-glow-primary bg-[#18181c]'
                  : 'border-zinc-800 hover:border-zinc-600'
              }`}
            >
              {/* TOP: Full-Width Large Visual Resume Preview (55-65% card height) */}
              <div className="relative">
                <TemplateThumbnail
                  templateId={tmpl.id}
                  onPreviewClick={() => handleSelectTemplate(tmpl.id)}
                />

                {/* Selected Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-xs font-bold shadow-xl">
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>✓ Selected</span>
                  </div>
                )}

                {/* Category Tag Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-950/90 text-zinc-200 border border-zinc-700 shadow-md backdrop-blur-md">
                    {tmpl.tag}
                  </span>
                </div>

                {/* Quick Preview Button on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(tmpl.id);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold shadow-xl transition-all transform translate-y-2 group-hover:translate-y-0"
                  >
                    <Eye className="w-3.5 h-3.5 text-black" />
                    <span>Click to Preview Full Screen</span>
                  </button>
                </div>
              </div>

              {/* MIDDLE: Name, Category/Tag, Description */}
              <div className="p-5 space-y-2.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-lg transition-colors ${isSelected ? 'text-white' : 'text-white group-hover:text-zinc-200'}`}>
                    {tmpl.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {tmpl.category}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {tmpl.description}
                </p>

                <div className="pt-2 border-t border-zinc-800/60 text-[11px]">
                  <span className="text-zinc-500">Best for: </span>
                  <span className="text-zinc-200 font-medium">{tmpl.recommendedFor}</span>
                </div>
              </div>

              {/* BOTTOM: Preview & Selection Controls */}
              <div className="p-4 bg-[#0F0F12] border-t border-zinc-800/80 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(tmpl.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(tmpl.id);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-black shadow-sm font-bold'
                      : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <span>Select</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar for Next */}
      <div className="sticky bottom-4 z-30 max-w-7xl mx-auto p-4 rounded-2xl bg-[#0F0F12]/95 border border-zinc-800 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {selectedTemplate ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              <span className="text-xs text-zinc-200 font-medium">
                Selected Template: <strong className="text-white capitalize">{selectedTemplate}</strong>
              </span>
            </div>
          ) : (
            <span className="text-xs text-zinc-400">
              Please click a template above to select it.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/dashboard"
            className="flex-1 sm:flex-initial text-center py-2.5 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={() => handleNext()}
            disabled={isCreating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-bold text-sm shadow-sm transition-all hover:translate-y-[-1px]"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Creating Resume...</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Large Professional Preview Modal */}
      {previewTemplate && currentPreviewMeta && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn"
          onClick={() => setPreviewTemplate(null)}
        >
          <div 
            className="bg-[#141417] border border-zinc-800 rounded-2xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:px-6 border-b border-zinc-800 flex items-center justify-between bg-[#0F0F12]">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {currentPreviewMeta.name} Resume Template
                </h3>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700">
                  {currentPreviewMeta.tag}
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Zoom Controls */}
                <div className="flex items-center bg-[#09090B] rounded-lg border border-zinc-800 p-0.5 text-xs">
                  <button
                    onClick={() => setModalZoom((z) => Math.max(0.6, z - 0.1))}
                    className="p-1 hover:text-white text-zinc-400 transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px] text-zinc-300">
                    {Math.round(modalZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setModalZoom((z) => Math.min(1.25, z + 0.1))}
                    className="p-1 hover:text-white text-zinc-400 transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setModalZoom(0.95)}
                    className="p-1 hover:text-white text-zinc-400 transition-colors ml-0.5"
                    title="Reset zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                {/* "Use This Template" Action */}
                <button
                  type="button"
                  onClick={() => {
                    handleSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-sm transition-all hover:translate-y-[-0.5px]"
                >
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Use This Template</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Readable Resume Container */}
            <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-[#09090B] flex justify-center items-start custom-scrollbar">
              <div 
                className="transition-transform duration-200 origin-top shadow-2xl my-auto"
                style={{ transform: `scale(${modalZoom})` }}
              >
                <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-900 shadow-2xl rounded-sm overflow-hidden">
                  <TemplateRenderer
                    templateId={previewTemplate}
                    data={sampleResumeData}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Bar */}
            <div className="p-3 sm:px-6 bg-[#0F0F12] border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
              <p>
                <strong className="text-zinc-200">Best suited for:</strong> {currentPreviewMeta.recommendedFor}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  Back to Selection
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="text-white hover:underline font-semibold"
                >
                  Select & Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
