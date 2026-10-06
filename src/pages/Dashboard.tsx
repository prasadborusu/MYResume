import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resumeService } from '../services/resumeService';
import { ResumeRecord } from '../types/resume';
import { calculateResumeCompletion } from '../utils/resumeMetrics';
import { exportResumeToPdf } from '../services/pdfService';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Eye, 
  Download, 
  Trash2, 
  Copy, 
  MoreHorizontal, 
  AlertTriangle,
  X,
  FileCheck
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadResumes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await resumeService.getUserResumes(user.id);
      setResumes(data);
    } catch (err) {
      console.error('Failed to load resumes:', err);
      showToast('Failed to load resumes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, [user]);

  // Duplicate Handler
  const handleDuplicate = async (id: string) => {
    if (!user) return;
    try {
      const duplicated = await resumeService.duplicateResume(id, user.id);
      if (duplicated) {
        showToast(`Duplicated "${duplicated.title}"`, 'success');
        loadResumes();
      }
    } catch (e) {
      showToast('Failed to duplicate resume.', 'error');
    } finally {
      setActiveMenuId(null);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const success = await resumeService.deleteResume(deleteId);
      if (success) {
        showToast('Resume deleted.', 'success');
        setResumes((prev) => prev.filter((r) => r.id !== deleteId));
      }
    } catch (e) {
      showToast('Failed to delete resume.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  // PDF Export
  const handleDownloadPdf = async (resume: ResumeRecord) => {
    setExportingId(resume.id);
    showToast('Exporting PDF...', 'info');

    try {
      const success = await exportResumeToPdf({
        elementId: `dashboard-doc-${resume.id}`,
        fullName: resume.resume_data?.personal?.fullName || resume.title,
        fileName: resume.title,
      });

      if (success) {
        showToast('PDF downloaded successfully!', 'success');
      } else {
        navigate(`/resume/${resume.id}/preview`);
      }
    } catch (err) {
      navigate(`/resume/${resume.id}/preview`);
    } finally {
      setExportingId(null);
      setActiveMenuId(null);
    }
  };

  const formatRelativeDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 0) return 'Updated today';
      if (diffDays === 1) return 'Updated yesterday';
      if (diffDays < 7) return `Updated ${diffDays} days ago`;
      
      return `Updated ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } catch {
      return 'Updated recently';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Workspace Header with Single Prominent Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Resume
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create and manage your professional resumes.
          </p>
        </div>

        {/* The ONE and only prominent Primary Action */}
        <Link
          to="/resume/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-sm font-semibold shadow-sm transition-all hover:translate-y-[-1px] shrink-0"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>+ Create Resume</span>
        </Link>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500 space-y-3">
          <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        /* Simple Compact Centered Empty State */
        <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6 text-zinc-500" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">No resumes yet</h2>
            <p className="text-xs text-zinc-400">
              Create your first professional resume in just a few minutes.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/resume/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>+ Create Resume</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Resumes Grid */
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300">Your Resumes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => {
              const completion = calculateResumeCompletion(resume.resume_data);
              const formattedDate = formatRelativeDate(resume.updated_at);
              const templateName = `${resume.template_id.charAt(0).toUpperCase() + resume.template_id.slice(1)} Template`;

              return (
                <div
                  key={resume.id}
                  className="rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between p-5 space-y-4 shadow-card"
                >
                  {/* Card Info */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-white truncate">
                        {resume.title}
                      </h3>

                      {/* Dropdown Menu for Secondary Actions (Duplicate / Delete) */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === resume.id ? null : resume.id)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === resume.id && (
                          <div 
                            className="absolute right-0 top-7 z-20 w-36 rounded-xl bg-[#18181B] border border-zinc-700 py-1 shadow-2xl space-y-0.5 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleDuplicate(resume.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-left transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteId(resume.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-left transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400">
                      {templateName}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {formattedDate}
                    </p>
                  </div>

                  {/* Completion Meter */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-400 font-medium">Completion</span>
                      <span className="font-semibold text-zinc-200">
                        {completion.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${completion.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Hidden renderer container for direct PDF export */}
                  <div id={`dashboard-doc-${resume.id}`} className="hidden">
                    <TemplateRenderer templateId={resume.template_id} data={resume.resume_data} />
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 text-xs">
                    <Link
                      to={`/resume/${resume.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-semibold transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <Link
                      to={`/resume/${resume.id}/preview`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(resume)}
                      disabled={exportingId === resume.id}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="Download PDF"
                    >
                      <Download className={`w-3.5 h-3.5 ${exportingId === resume.id ? 'animate-bounce' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Simple Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white">Delete this resume?</h3>
              <p className="text-xs text-zinc-400">
                This will permanently delete this resume from your workspace.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
