import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/Icons';

interface TemplateProps {
  data: ResumeData;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, summary, objective, education, skills, projects, experience, certifications, achievements, languages } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const contactItems = [
    personal.location,
    personal.phone,
    personal.email,
    personal.linkedin ? personal.linkedin.replace(/^https?:\/\/(www\.)?/, '') : '',
    personal.portfolio ? personal.portfolio.replace(/^https?:\/\/(www\.)?/, '') : '',
    personal.github ? personal.github.replace(/^https?:\/\/(www\.)?/, '') : ''
  ].filter(Boolean);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans p-8 md:p-10 leading-normal text-[12.5px] print:p-0 print:text-[11.5px] min-h-[1050px]">
      {/* Executive Header */}
      <header className="border-b-4 border-slate-900 pb-4 mb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
          {personal.fullName || 'Executive Leader'}
        </h1>
        {personal.jobTitle && (
          <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mt-0.5">
            {personal.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5 text-xs text-slate-600 font-medium">
          {contactItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < contactItems.length - 1 && <span className="text-slate-400 font-bold">|</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className="space-y-4">
        {/* Career Objective */}
        {objective && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
              Career Objective
            </h2>
            <p className="text-slate-800 text-xs leading-relaxed text-left">
              {objective}
            </p>
          </section>
        )}

        {/* Executive Profile */}
        {summary && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
              Executive Profile
            </h2>
            <p className="text-slate-800 text-xs leading-relaxed text-left">
              {summary}
            </p>
          </section>
        )}

        {/* Executive Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-2">
              Leadership & Professional Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-slate-950 text-xs">{exp.position}</span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} {exp.location && `| ${exp.location}`}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">{exp.company}</p>
                  {exp.description && (
                    <div className="text-slate-800 mt-1 text-xs whitespace-pre-line space-y-0.5">
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

        {/* Key Projects / Strategic Initiatives */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-2">
              Strategic Initiatives & Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-slate-950 text-xs">{proj.name} {proj.role && <span className="font-medium text-slate-600">({proj.role})</span>}</span>
                    {proj.technologies && <span className="text-xs text-slate-600 font-medium">Stack: {proj.technologies}</span>}
                  </div>
                  {proj.description && (
                    <div className="text-slate-800 mt-0.5 text-xs whitespace-pre-line space-y-0.5">
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

        {/* Core Competencies & Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
              Core Competencies & Expertise
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              {Object.entries(groupedSkills).map(([cat, items]) => (
                <p key={cat}>
                  <strong className="text-slate-950 font-bold">{cat}:</strong> {items.join(', ')}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-2">
              Education & Professional Development
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline flex-wrap text-xs">
                  <div>
                    <span className="font-bold text-slate-950">{edu.institution}</span>
                    <p className="text-slate-700">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''} {edu.grade && `(${edu.grade})`}</p>
                  </div>
                  <span className="text-slate-600 font-medium">{edu.startYear} – {edu.endYear || 'Present'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Honors, Certifications & Languages */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0) || (languages && languages.length > 0)) && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-1.5">
              Certifications & Key Recognitions
            </h2>
            <ul className="space-y-1 text-xs text-slate-800">
              {certifications?.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong> — {c.issuer} ({c.date})
                </li>
              ))}
              {achievements?.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}:</strong> {a.description}
                </li>
              ))}
              {languages && languages.length > 0 && (
                <li className="pt-0.5">
                  <strong>Languages:</strong> {languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
                </li>
              )}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
