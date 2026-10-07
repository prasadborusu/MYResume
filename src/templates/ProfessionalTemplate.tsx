import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe, Award, GraduationCap } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/Icons';

interface TemplateProps {
  data: ResumeData;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, summary, objective, education, skills, projects, experience, certifications, achievements, languages } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans leading-relaxed text-[12.5px] print:text-[11.5px] min-h-[1123px] box-border flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full md:w-[34%] bg-slate-900 text-slate-100 p-6 md:p-7 shrink-0 space-y-5 print:w-[32%] print:bg-slate-900 print:text-white">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
            {personal.fullName || 'Professional'}
          </h1>
          {personal.jobTitle && (
            <p className="text-xs font-semibold text-emerald-400 mt-1 uppercase tracking-wider">
              {personal.jobTitle}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs text-slate-300">
          <div className="mb-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Contact
            </h3>
            <div className="h-[1px] w-full bg-slate-700 mt-1" />
          </div>
          {personal.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-2">
              <LinkedinIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personal.github && (
            <div className="flex items-center gap-2">
              <GithubIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personal.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{personal.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
        </div>

        {/* Education (in sidebar) */}
        {education && education.length > 0 && (
          <div className="space-y-2">
            <div className="mb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                Education
              </h3>
              <div className="h-[1px] w-full bg-slate-700 mt-1" />
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <p className="font-semibold text-white">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                <p className="text-slate-400">{edu.institution} {edu.grade && `(${edu.grade})`}</p>
                <p className="text-[11px] text-slate-500">{edu.startYear} – {edu.endYear || 'Present'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills (in sidebar) */}
        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <div className="mb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Skills
              </h3>
              <div className="h-[1px] w-full bg-slate-700 mt-1" />
            </div>
            {Object.entries(groupedSkills).map(([cat, items]) => (
              <div key={cat} className="text-xs">
                <span className="text-emerald-400 font-semibold block text-[11px]">{cat}:</span>
                <span className="text-slate-300 leading-snug">{items.join(', ')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Languages (in sidebar) */}
        {languages && languages.length > 0 && (
          <div className="space-y-1 text-xs">
            <div className="mb-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Languages
              </h3>
              <div className="h-[1px] w-full bg-slate-700 mt-1" />
            </div>
            {languages.map((l) => (
              <div key={l.id} className="flex justify-between text-slate-300">
                <span>{l.language}</span>
                <span className="text-slate-400 text-[11px]">{l.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Column */}
      <main className="flex-1 p-6 md:p-8 space-y-4">
        {/* Career Objective */}
        {objective && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-bold text-zinc-950 uppercase tracking-wider leading-none">
                Career Objective
              </h2>
              <div className="h-[1.5px] w-full bg-zinc-950 mt-1" />
            </div>
            <p className="text-zinc-700 leading-relaxed text-left text-xs">
              {objective}
            </p>
          </section>
        )}

        {/* Professional Profile / Summary */}
        {summary && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-bold text-zinc-950 uppercase tracking-wider leading-none">
                Professional Profile
              </h2>
              <div className="h-[1.5px] w-full bg-zinc-950 mt-1" />
            </div>
            <p className="text-zinc-700 leading-relaxed text-left text-xs">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider leading-none">
                Work History
              </h2>
              <div className="h-[1.5px] w-full bg-slate-900 mt-1" />
            </div>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-zinc-950 text-xs">{exp.position}</span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800">{exp.company} {exp.location && <span className="font-normal text-zinc-500">| {exp.location}</span>}</p>
                  {exp.description && (
                    <div className="text-zinc-700 mt-1 text-xs whitespace-pre-line space-y-0.5">
                      {exp.description.split('\n').map((line, i) => (
                        <p key={i} className="leading-snug">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider leading-none">
                Key Projects & Contributions
              </h2>
              <div className="h-[1.5px] w-full bg-slate-900 mt-1" />
            </div>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-zinc-900 text-xs">{proj.name}</span>
                    {proj.technologies && (
                      <span className="text-[11px] text-zinc-500 font-medium">[{proj.technologies}]</span>
                    )}
                  </div>
                  {proj.description && (
                    <div className="text-zinc-700 mt-0.5 text-xs whitespace-pre-line space-y-0.5">
                      {proj.description.split('\n').map((line, i) => (
                        <p key={i} className="leading-snug">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider leading-snug">
                Certifications & Highlights
              </h2>
              <div className="h-[1.5px] w-full bg-slate-900 mt-1" />
            </div>
            <ul className="space-y-1 text-xs text-zinc-700">
              {certifications?.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span><strong>{c.name}</strong> — {c.issuer}</span>
                  <span className="text-zinc-500 text-[11px]">{c.date}</span>
                </li>
              ))}
              {achievements?.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}:</strong> {a.description}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};
