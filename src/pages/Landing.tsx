import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { sampleResumeData } from '../utils/initialData';
import { TEMPLATES } from '../templates/templateList';
import { 
  FileText, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Layout, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Layers, 
  Eye, 
  Check, 
  Star,
  Users
} from 'lucide-react';

export const Landing: React.FC = () => {
  const [selectedHeroTemplate, setSelectedHeroTemplate] = React.useState<'modern' | 'minimal' | 'classic' | 'developer'>('modern');

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-zinc-800/60">
        {/* Subtle background ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.03] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Smart Template Generation • ATS-Friendly • Free PDF Export</span>
            </div>

            {/* Main Title & Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Build your professional resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">easily.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Create a clean, professional, ATS-friendly resume in minutes. Built specifically for students, freshers, and job seekers with instant live preview and smart action-verb phrasing.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-base shadow-xl shadow-white/10 transition-all hover:translate-y-[-1px]"
              >
                <span>Create My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/templates"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white font-medium text-base transition-all"
              >
                <Layout className="w-4 h-4 text-zinc-400" />
                <span>View Templates</span>
              </Link>
            </div>

            {/* Trust metrics */}
            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-white" /> 100% Free to use
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-white" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-white" /> Instant PDF download
              </span>
            </div>
          </div>

          {/* Interactive Hero Resume Preview Showcase */}
          <div className="mt-14 max-w-4xl mx-auto">
            {/* Template switcher bar */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-zinc-800 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Eye className="w-4 h-4 text-zinc-300" />
                <span>Interactive Live Preview:</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#141417] p-1 rounded-lg border border-zinc-800">
                {(['modern', 'minimal', 'classic', 'developer'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedHeroTemplate(t)}
                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                      selectedHeroTemplate === t
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Frame Container */}
            <div className="p-2 sm:p-4 rounded-2xl bg-[#141417] border border-zinc-800 shadow-2xl overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="rounded-lg overflow-hidden bg-white shadow-lg pointer-events-none select-none origin-top">
                <TemplateRenderer
                  templateId={selectedHeroTemplate}
                  data={sampleResumeData}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-[#0C0C0E] border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Powerful Tools</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              Everything you need to craft an interview-winning resume
            </p>
            <p className="text-sm text-zinc-400">
              Designed according to industry ATS standards so recruiters and applicant tracking systems can easily read your achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-600 transition-all hover:translate-y-[-2px] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Easy Structured Builder</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Step-by-step forms for education, projects, skills, and work experience. No messy formatting or broken table layouts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-600 transition-all hover:translate-y-[-2px] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Content Generator</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatically generate professional summaries, objectives, and project descriptions powered by strong action verbs and role templates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-600 transition-all hover:translate-y-[-2px] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">6 ATS-Friendly Templates</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Choose from Modern, Minimal, Classic, Professional, Academic, and Developer layouts. Switch anytime with a single click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-600 transition-all hover:translate-y-[-2px] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Live Instant Preview</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                See your changes rendered in real-time right alongside your editor. Zoom in, inspect layouts, and check page flow effortlessly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-600 transition-all hover:translate-y-[-2px] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Pixel-Perfect PDF Export</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download crisp, print-ready A4 PDFs named after you. Consistent typography, precise margins, and multi-page calculation.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-600 transition-all hover:translate-y-[-2px] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Secure Cloud Autosave</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your resumes are continuously autosaved with Supabase PostgreSQL and Row Level Security. Never lose your edits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#09090B] border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Simple Workflow</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              Create your resume in 5 simple steps
            </p>
            <p className="text-sm text-zinc-400">
              Go from blank page to a job-ready PDF in under 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'Create Account', desc: 'Sign up securely and verify your email via 6-digit OTP code.' },
              { num: '02', title: 'Enter Details', desc: 'Fill in education, skills, projects, and work experience.' },
              { num: '03', title: 'Choose Template', desc: 'Select from 6 clean, ATS-optimized layouts tailored for your domain.' },
              { num: '04', title: 'Generate Content', desc: 'Use smart bullet suggestions to polish and rephrase your achievements.' },
              { num: '05', title: 'Download PDF', desc: 'Export an A4 PDF ready to upload to LinkedIn or job portals.' },
            ].map((step) => (
              <div key={step.num} className="p-5 rounded-xl bg-[#141417] border border-zinc-800 space-y-2 relative">
                <span className="text-2xl font-black text-zinc-600">{step.num}</span>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section className="py-20 bg-[#0C0C0E] border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Designed for Hiring Managers</h2>
              <p className="text-3xl font-extrabold text-white tracking-tight">
                Curated Resume Templates
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                Zero distracting icons or broken parsing. Every template is strictly ATS-compliant.
              </p>
            </div>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-200 hover:text-white"
            >
              <span>Explore all templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATES.slice(0, 3).map((tmpl) => (
              <div
                key={tmpl.id}
                className="group rounded-2xl bg-[#141417] border border-zinc-800 hover:border-zinc-600 overflow-hidden transition-all duration-300 flex flex-col"
              >
                <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{tmpl.name}</h3>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {tmpl.tag}
                  </span>
                </div>
                <div className="p-4 bg-zinc-950/60 flex-1 space-y-3">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tmpl.description}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    Best for: <span className="text-zinc-200">{tmpl.recommendedFor}</span>
                  </p>
                </div>
                <div className="p-4 bg-[#141417] border-t border-zinc-800/80 flex items-center justify-between">
                  <Link
                    to="/resume/new"
                    className="w-full text-center py-2 px-3 rounded-lg bg-zinc-800 hover:bg-white text-zinc-200 hover:text-black border border-zinc-700 text-xs font-semibold transition-all shadow-sm"
                  >
                    Use This Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-16 bg-gradient-to-b from-[#09090B] to-[#121216]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to build your professional resume?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Join thousands of students and job seekers creating interview-ready resumes today.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-base shadow-xl shadow-white/10 transition-all hover:translate-y-[-1px]"
            >
              <span>Create My Resume Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
