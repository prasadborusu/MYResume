import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { resumeService } from '../services/resumeService';
import { exportResumeToPdf, printResume } from '../services/pdfService';
import { ResumeRecord, TemplateId } from '../types/resume';
import { TEMPLATES } from '../templates/templateList';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { 
  ArrowLeft, 
  Edit3, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Palette, 
  Check, 
  Sparkles,
  Layout
} from 'lucide-react';

export const ResumePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>('modern');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadResume() {
      if (!id) return;
      try {
        setLoading(true);
        const record = await resumeService.getResumeById(id);
        if (record) {
          setResume(record);
          setTemplateId(record.template_id || 'modern');
        } else {
          showToast('Resume not found.', 'error');
          navigate('/dashboard');
        }
      } catch (err) {
        showToast('Error loading resume preview.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadResume();
  }, [id, navigate]);

  const handleTemplateChange = async (newTmpl: TemplateId) => {
    setTemplateId(newTmpl);
    if (id) {
      await resumeService.updateResume(id, { template_id: newTmpl });
      showToast(`Updated template to ${newTmpl}`, 'info', 1500);
    }
  };

  const handleExportPdf = async () => {
    if (!resume) return;
    setIsExporting(true);
    showToast('Exporting high-resolution A4 PDF...', 'info');

    try {
      const success = await exportResumeToPdf({
        elementId: 'full-resume-preview-document',
        fullName: resume.resume_data?.personal?.fullName || resume.title,
        fileName: resume.title,
      });

      if (success) {
        showToast('PDF downloaded successfully!', 'success');
      } else {
        showToast('PDF export failed. Try browser print.', 'error');
      }
    } catch (e) {
      showToast('Error generating PDF.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading || !resume) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Rendering Full Preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0F0F12] border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            to={`/resume/${id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Resume</span>
          </Link>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[220px] sm:max-w-md">
              {resume.title}
            </h1>
          </div>
        </div>

        {/* Center: Template Picker Pills */}
        <div className="hidden md:flex items-center gap-1 bg-[#141417] p-1 rounded-xl border border-zinc-800">
          {TEMPLATES.map((tmpl) => {
            const isSelected = templateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => handleTemplateChange(tmpl.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tmpl.name}
              </button>
            );
          })}
        </div>

        {/* Right: Controls (Zoom, Print, PDF) */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-[#141417] rounded-lg border border-zinc-800 p-0.5 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
              className="p-1 hover:text-white text-zinc-400"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-zinc-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 hover:text-white text-zinc-400"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={printResume}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium transition-colors border border-zinc-700/80"
            title="Save as 100% Vector PDF via browser print dialog"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-300" />
            <span>Print / Vector PDF</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-50 text-black text-xs font-semibold shadow-sm transition-all hover:translate-y-[-0.5px]"
          >
            {isExporting ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-black" />
            )}
            <span>Download A4 PDF</span>
          </button>
        </div>
      </header>

      {/* Main Preview Workspace */}
      <main className="flex-1 bg-[#09090B] p-4 sm:p-10 flex justify-center items-start overflow-y-auto">
        <div
          className="transition-transform duration-200 origin-top shadow-2xl"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div
            id="full-resume-preview-document"
            className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl rounded-sm overflow-hidden"
          >
            <TemplateRenderer
              templateId={templateId}
              data={resume.resume_data}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
