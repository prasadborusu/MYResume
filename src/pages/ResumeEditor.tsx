import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resumeService } from '../services/resumeService';
import { exportResumeToPdf, printResume } from '../services/pdfService';
import { ResumeRecord, ResumeData, TemplateId } from '../types/resume';
import { calculateResumeCompletion } from '../utils/resumeMetrics';
import { TEMPLATES } from '../templates/templateList';
import { TemplateRenderer } from '../templates/TemplateRenderer';

// Form Sub-components
import { PersonalForm } from '../components/editor/PersonalForm';
import { ObjectiveSummaryForm } from '../components/editor/ObjectiveSummaryForm';
import { EducationForm } from '../components/editor/EducationForm';
import { SkillsForm } from '../components/editor/SkillsForm';
import { ProjectsForm } from '../components/editor/ProjectsForm';
import { ExperienceForm } from '../components/editor/ExperienceForm';
import { CertificationsForm } from '../components/editor/CertificationsForm';
import { AchievementsForm } from '../components/editor/AchievementsForm';
import { LanguagesForm } from '../components/editor/LanguagesForm';

import { 
  ArrowLeft, 
  Save, 
  Check, 
  Download, 
  Printer, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles, 
  User, 
  Target, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Briefcase, 
  Award, 
  Trophy, 
  Languages as LangIcon,
  ChevronRight,
  Palette,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

type EditorSection = 
  | 'personal'
  | 'objective'
  | 'education'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'certifications'
  | 'achievements'
  | 'languages';

export const ResumeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>('modern');
  const [title, setTitle] = useState('');
  
  const [activeSection, setActiveSection] = useState<EditorSection>('personal');
  const [activeTabMobile, setActiveTabMobile] = useState<'editor' | 'preview'>('editor');
  const [zoomLevel, setZoomLevel] = useState<number>(0.9);
  
  // Save status: 'saved' | 'saving' | 'error'
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  // Load Resume
  useEffect(() => {
    async function loadResume() {
      if (!id) return;
      try {
        setLoading(true);
        const record = await resumeService.getResumeById(id);
        if (record) {
          setResume(record);
          setResumeData(record.resume_data);
          setTemplateId(record.template_id || 'modern');
          setTitle(record.title || 'Untitled Resume');
          hasInitialized.current = true;
        } else {
          showToast('Resume not found.', 'error');
          navigate('/dashboard');
        }
      } catch (err) {
        showToast('Error loading resume.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadResume();
  }, [id, navigate]);

  // Debounced Autosave Effect
  const performSave = useCallback(
    async (updatedData: ResumeData, updatedTemplate: TemplateId, updatedTitle: string) => {
      if (!id || !hasInitialized.current) return;
      setSaveStatus('saving');

      try {
        const saved = await resumeService.updateResume(id, {
          resume_data: updatedData,
          template_id: updatedTemplate,
          title: updatedTitle,
        });

        if (saved) {
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }
      } catch (e) {
        console.error('Autosave error:', e);
        setSaveStatus('error');
      }
    },
    [id]
  );

  const triggerAutosave = (updatedData: ResumeData, updatedTemplate: TemplateId, updatedTitle: string) => {
    setSaveStatus('saving');
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      performSave(updatedData, updatedTemplate, updatedTitle);
    }, 750);
  };

  // Data update helper
  const handleDataChange = (updater: (prev: ResumeData) => ResumeData) => {
    if (!resumeData) return;
    const next = updater(resumeData);
    setResumeData(next);
    triggerAutosave(next, templateId, title);
  };

  // Template switch
  const handleTemplateChange = (newTmpl: TemplateId) => {
    setTemplateId(newTmpl);
    if (resumeData) {
      triggerAutosave(resumeData, newTmpl, title);
      showToast(`Switched template to "${newTmpl}"`, 'info', 2000);
    }
  };

  // Title change
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (resumeData) {
      triggerAutosave(resumeData, templateId, newTitle);
    }
  };

  // Reset to clean blank resume
  const handleResetToBlank = () => {
    if (window.confirm('Are you sure you want to clear all data and start with an empty resume?')) {
      const blank: ResumeData = {
        personal: {
          fullName: profile?.full_name || '',
          jobTitle: '',
          email: user?.email || '',
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
      setResumeData(blank);
      triggerAutosave(blank, templateId, title);
      showToast('Cleared all data. Starting with a blank resume!', 'info');
    }
  };

  // PDF Export
  const handleExportPdf = async () => {
    if (!resumeData) return;
    setIsExporting(true);
    showToast('Exporting high-resolution A4 PDF...', 'info');

    try {
      const success = await exportResumeToPdf({
        elementId: 'resume-preview-document',
        fullName: resumeData.personal?.fullName || title,
        fileName: title,
      });

      if (success) {
        showToast('PDF downloaded successfully!', 'success');
      } else {
        showToast('PDF generation failed. Please try print dialog.', 'error');
      }
    } catch (err) {
      showToast('Error exporting PDF.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading || !resumeData) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Opening Resume Editor...</p>
      </div>
    );
  }

  const completion = calculateResumeCompletion(resumeData);

  const sectionsList = [
    { id: 'personal', name: 'Personal Details', icon: User },
    { id: 'objective', name: 'Summary & Objective', icon: Target },
    { id: 'experience', name: 'Work Experience', icon: Briefcase, count: resumeData.experience?.length },
    { id: 'projects', name: 'Projects', icon: FolderGit2, count: resumeData.projects?.length },
    { id: 'skills', name: 'Skills', icon: Wrench, count: resumeData.skills?.length },
    { id: 'education', name: 'Education', icon: GraduationCap, count: resumeData.education?.length },
    { id: 'certifications', name: 'Certifications', icon: Award, count: resumeData.certifications?.length },
    { id: 'achievements', name: 'Achievements', icon: Trophy, count: resumeData.achievements?.length },
    { id: 'languages', name: 'Languages', icon: LangIcon, count: resumeData.languages?.length },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col">
      {/* Editor Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0F0F12] border-b border-zinc-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md no-print">
        {/* Left: Back & Title Edit */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title="Return to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent hover:bg-zinc-800/50 focus:bg-[#141417] text-white font-bold text-sm sm:text-base px-2 py-1 rounded-lg border border-transparent hover:border-zinc-700 focus:border-zinc-400 focus:outline-none transition-all truncate max-w-[200px] sm:max-w-xs"
            title="Click to rename"
          />

          {/* Autosave Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-zinc-300 animate-pulse font-medium">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" /> Saving...
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1 text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Unable to save
              </span>
            )}
          </div>
        </div>

        {/* Center: Change Template Selector */}
        <div className="flex items-center gap-2 bg-[#141417] px-2.5 py-1 rounded-xl border border-zinc-800">
          <Palette className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-[11px] font-semibold text-zinc-400 hidden sm:inline">Change Template:</span>
          <select
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
            className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer capitalize"
            title="Switch resume template"
          >
            {TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id} className="bg-[#141417] text-zinc-100">
                {tmpl.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Actions (Zoom, Print, Full Preview, PDF Download) */}
        <div className="flex items-center gap-2">
          {/* Zoom controls (desktop) */}
          <div className="hidden xl:flex items-center bg-[#141417] rounded-lg border border-zinc-800 p-0.5 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1 hover:text-white text-zinc-400"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-zinc-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
              className="p-1 hover:text-white text-zinc-400"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clear / Reset to Blank */}
          <button
            onClick={handleResetToBlank}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 transition-colors"
            title="Clear all fields and start with a blank resume"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Clear to Blank</span>
          </button>

          {/* Full Preview Page */}
          <Link
            to={`/resume/${id}/preview`}
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title="Open Full Screen Preview"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {/* Print / Vector PDF */}
          <button
            onClick={printResume}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium transition-colors border border-zinc-700/80"
            title="Save as 100% Vector PDF via browser print dialog"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-300" />
            <span>Print / Vector PDF</span>
          </button>

          {/* Download PDF CTA */}
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-50 text-black text-xs font-semibold shadow-sm transition-all hover:translate-y-[-0.5px]"
          >
            {isExporting ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-black" />
            )}
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Mobile Toggle Tabs */}
      <div className="lg:hidden flex border-b border-zinc-800 bg-[#0F0F12] no-print">
        <button
          onClick={() => setActiveTabMobile('editor')}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
            activeTabMobile === 'editor'
              ? 'border-white text-white bg-zinc-800/40'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Form Editor
        </button>
        <button
          onClick={() => setActiveTabMobile('preview')}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
            activeTabMobile === 'preview'
              ? 'border-white text-white bg-zinc-800/40'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Section Nav & Form Editor */}
        <div
          className={`w-full lg:w-1/2 xl:w-[48%] flex flex-col border-r border-zinc-800 bg-[#09090B] overflow-y-auto no-print ${
            activeTabMobile === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Progress & Section Selector Pills */}
          <div className="p-4 bg-[#0C0C0E] border-b border-zinc-800 space-y-3 sticky top-0 z-20">
            {/* Completion Meter */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">
                Resume Completion: <strong className="text-zinc-100">{completion.percentage}%</strong>
              </span>
              <span className="text-[11px] text-zinc-500">
                {completion.percentage === 100 ? 'All sections filled!' : 'Fill in key fields for higher ATS score'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 bg-white"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>

            {/* Horizontal Section Selector Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {sectionsList.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id as EditorSection)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'bg-[#141417] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sec.name}</span>
                    {sec.count !== undefined && sec.count > 0 && (
                      <span className={`text-[10px] px-1 rounded-full ${isActive ? 'bg-zinc-200 text-black font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                        {sec.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Form Content */}
          <div className="p-4 sm:p-6 space-y-6 flex-1">
            {activeSection === 'personal' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Personal Information</h2>
                  <p className="text-xs text-zinc-400">Recruiters will use these details to contact you.</p>
                </div>
                <PersonalForm
                  data={resumeData.personal}
                  onChange={(p) => handleDataChange((prev) => ({ ...prev, personal: p }))}
                />
              </div>
            )}

            {activeSection === 'objective' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Objective & Summary</h2>
                  <p className="text-xs text-zinc-400">Generate or customize your professional elevator pitch.</p>
                </div>
                <ObjectiveSummaryForm
                  objective={resumeData.objective}
                  summary={resumeData.summary}
                  jobTitle={resumeData.personal?.jobTitle}
                  skills={resumeData.skills}
                  onObjectiveChange={(obj) => handleDataChange((prev) => ({ ...prev, objective: obj }))}
                  onSummaryChange={(sum) => handleDataChange((prev) => ({ ...prev, summary: sum }))}
                />
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Work Experience</h2>
                  <p className="text-xs text-zinc-400">List relevant jobs, internships, or professional freelance roles.</p>
                </div>
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(exp) => handleDataChange((prev) => ({ ...prev, experience: exp }))}
                />
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Key Projects</h2>
                  <p className="text-xs text-zinc-400">Showcase technical builds, hackathon entries, or production tools.</p>
                </div>
                <ProjectsForm
                  data={resumeData.projects}
                  onChange={(proj) => handleDataChange((prev) => ({ ...prev, projects: proj }))}
                />
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Technical Skills</h2>
                  <p className="text-xs text-zinc-400">Organize your languages, frameworks, databases, and toolsets.</p>
                </div>
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(sk) => handleDataChange((prev) => ({ ...prev, skills: sk }))}
                />
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Education & Academics</h2>
                  <p className="text-xs text-zinc-400">Add degrees, universities, GPAs, and honors.</p>
                </div>
                <EducationForm
                  data={resumeData.education}
                  onChange={(edu) => handleDataChange((prev) => ({ ...prev, education: edu }))}
                />
              </div>
            )}

            {activeSection === 'certifications' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Certifications & Licenses</h2>
                  <p className="text-xs text-zinc-400">Add cloud credentials, course completions, and certificates.</p>
                </div>
                <CertificationsForm
                  data={resumeData.certifications}
                  onChange={(c) => handleDataChange((prev) => ({ ...prev, certifications: c }))}
                />
              </div>
            )}

            {activeSection === 'achievements' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Key Achievements & Honors</h2>
                  <p className="text-xs text-zinc-400">Highlight hackathon wins, top rankings, or open source contributions.</p>
                </div>
                <AchievementsForm
                  data={resumeData.achievements}
                  onChange={(a) => handleDataChange((prev) => ({ ...prev, achievements: a }))}
                />
              </div>
            )}

            {activeSection === 'languages' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h2 className="text-base font-bold text-white">Languages</h2>
                  <p className="text-xs text-zinc-400">List languages you speak and professional proficiencies.</p>
                </div>
                <LanguagesForm
                  data={resumeData.languages}
                  onChange={(l) => handleDataChange((prev) => ({ ...prev, languages: l }))}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live A4 Resume Preview */}
        <div
          className={`flex-1 bg-[#0F0F12] overflow-y-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:m-0 print:bg-white print:overflow-visible print:block print:w-full ${
            activeTabMobile === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Zoomable Container with A4 Page Boundaries */}
          <div
            className="transition-transform duration-200 origin-top shadow-2xl print:shadow-none print:transform-none"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div
              id="resume-preview-document"
              className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl rounded-sm overflow-hidden box-border print:shadow-none print:overflow-visible"
            >
              <TemplateRenderer
                templateId={templateId}
                data={resumeData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
