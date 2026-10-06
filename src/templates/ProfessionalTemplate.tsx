import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
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
    <div className="w-full bg-white text-zinc-900 font-sans leading-relaxed text-[12.5px] print:text-[11.5px] min-h-[1050px] flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full md:w-[34%] bg-slate-900 text-slate-100 p-6 md:p-7 shrink-0 space-y-5 print:w-[32%] print:bg-slate-900 print:text-white">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
            {personal.fullName || 'Your Name'}
          </h1>
          {personal.jobTitle && (
            <p className="text-xs font-semibold text-emerald-400 mt-1 uppercase tracking-wider">
              {personal.jobTitle}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-700">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</h3>
          {personal.email && (
            <div className="flex items-center gap-2 break-all">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{personal.email}</span>
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
            <div className="flex items-center gap-2 break-all">
              <LinkedinIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personal.github && (
            <div className="flex items-center gap-2 break-all">
              <GithubIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personal.portfolio && (
            <div className="flex items-center gap-2 break-all">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{personal.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expertise</h3>
            {Object.entries(groupedSkills).map(([cat, items]) => (
              <div key={cat} className="space-y-1">
                <span className="text-[11px] font-semibold text-emerald-400">{cat}</span>
                <div className="flex flex-wrap gap-1">
                  {items.map((skill, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Education</h3>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <p className="font-semibold text-white">{edu.degree}</p>
                {edu.fieldOfStudy && <p className="text-slate-300 text-[11px]">{edu.fieldOfStudy}</p>}
                <p className="text-slate-400 text-[11px]">{edu.institution}</p>
                <p className="text-emerald-400 text-[10px]">{edu.startYear} – {edu.endYear || 'Present'} {edu.grade ? `(${edu.grade})` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Languages</h3>
            {languages.map((l) => (
              <div key={l.id} className="flex justify-between text-xs text-slate-300">
                <span className="text-white">{l.language}</span>
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
            <h2 className="text-xs font-bold text-zinc-950 uppercase tracking-wider pb-1 border-b-2 border-zinc-950 mb-2">
              Career Objective
            </h2>
            <p className="text-zinc-700 leading-relaxed text-left text-xs">
              {objective}
            </p>
          </section>
        )}

        {/* Professional Profile / Summary */}
        {summary && (
          <section>
            <h2 className="text-xs font-bold text-zinc-950 uppercase tracking-wider pb-1 border-b-2 border-zinc-950 mb-2">
              Professional Profile
            </h2>
            <p className="text-zinc-700 leading-relaxed text-left text-xs">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b-2 border-slate-900 mb-2">
              Work History
            </h2>
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
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b-2 border-slate-900 mb-2">
              Key Projects & Contributions
            </h2>
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
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b-2 border-slate-900 mb-2">
              Certifications & Highlights
            </h2>
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
