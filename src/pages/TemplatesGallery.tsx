import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TEMPLATES } from '../templates/templateList';
import { TemplateId } from '../types/resume';
import { sampleResumeData } from '../utils/initialData';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { TemplateThumbnail } from '../components/resume/TemplateThumbnail';
import { resumeService } from '../services/resumeService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Eye, 
  Plus, 
  ArrowRight, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  FileCheck
} from 'lucide-react';

export const TemplatesGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null);
  const [modalZoom, setModalZoom] = useState<number>(0.95);

  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Modern', 'Minimal', 'Classic', 'Professional', 'Academic', 'Developer'];

  const filtered = selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleUseTemplate = async (templateId: TemplateId) => {
    if (!user) {
      showToast('Please sign in or register to create your resume.', 'info');
      navigate('/register');
      return;
    }

    try {
      const initialData = {
        personal: {
          fullName: profile?.full_name || '',
          jobTitle: '',
          email: user.email || '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          portfolio: ''
        },
        summary: '',
        objective: '',
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
        title: `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Resume`,
        templateId,
        initialData,
        isSample: false,
      });

      showToast(`Created new resume with ${templateId} template!`, 'success');
      navigate(`/resume/${newResume.id}/edit`);
    } catch (e) {
      showToast('Failed to create resume from template.', 'error');
    }
  };

  const currentTmplMeta = TEMPLATES.find((t) => t.id === previewTemplate);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider mb-2">
            <FileCheck className="w-3.5 h-3.5 text-black" />
            <span>100% Photo-Free & ATS-Friendly Templates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resume Templates
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse our ATS-optimized resume templates designed for students, freshers, and professionals.
          </p>
        </div>

        <Link
          to="/resume/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-sm font-semibold shadow-sm transition-all hover:translate-y-[-1px] shrink-0"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>+ Create Custom Resume</span>
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-white text-black shadow-sm font-bold'
                : 'bg-[#141417] text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid with Full-Width Visual Mini Resume Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="group rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-600 overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-card hover:shadow-2xl hover:translate-y-[-2px]"
          >
            {/* 1. Large Full-Width Visual Resume Preview (Occupying ~60% of card) */}
            <div className="relative">
              <TemplateThumbnail
                templateId={tmpl.id}
                onPreviewClick={() => setPreviewTemplate(tmpl.id)}
              />

              {/* Tag Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-950/90 text-zinc-200 border border-zinc-700 shadow-lg backdrop-blur-md">
                  {tmpl.tag}
                </span>
              </div>
            </div>

            {/* 2. Middle: Name, Category, Description, and Recommendation */}
            <div className="p-5 space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white group-hover:text-zinc-200 transition-colors">
                  {tmpl.name}
                </h3>
                <span className="text-[11px] text-zinc-400 font-medium capitalize">
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

            {/* 3. Bottom: Action Buttons */}
            <div className="p-4 bg-[#0F0F12] border-t border-zinc-800/80 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewTemplate(tmpl.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={() => handleUseTemplate(tmpl.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-sm transition-all hover:translate-y-[-0.5px]"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Large Professional Preview Modal */}
      {previewTemplate && currentTmplMeta && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn"
          onClick={() => setPreviewTemplate(null)}
        >
          <div 
            className="bg-[#141417] border border-zinc-800 rounded-2xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="p-4 sm:px-6 border-b border-zinc-800 flex items-center justify-between bg-[#0F0F12]">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {currentTmplMeta.name} Resume Template
                </h3>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700">
                  {currentTmplMeta.tag}
                </span>
              </div>

              {/* Modal Toolbar & Actions */}
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

                {/* Primary CTA inside modal */}
                <button
                  type="button"
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-sm transition-all hover:translate-y-[-0.5px]"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>

                {/* Close modal */}
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Readable A4 Canvas */}
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

            {/* Modal Footer Info Bar */}
            <div className="p-3 sm:px-6 bg-[#0F0F12] border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
              <p>
                <strong className="text-zinc-200">Recommended for:</strong> {currentTmplMeta.recommendedFor}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="text-white hover:underline font-semibold"
                >
                  Start Building with {currentTmplMeta.name} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
