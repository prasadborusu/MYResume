import React from 'react';
import { ResumeData } from '../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, summary, objective, education, skills, projects, experience, certifications, achievements, languages } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Strategic Competencies';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin ? personal.linkedin.replace(/^https?:\/\/(www\.)?/, '') : '',
    personal.portfolio ? personal.portfolio.replace(/^https?:\/\/(www\.)?/, '') : '',
    personal.github ? personal.github.replace(/^https?:\/\/(www\.)?/, '') : ''
  ].filter(Boolean);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans p-10 leading-normal text-[12.5px] min-h-[297mm] box-border">
      {/* Executive Header */}
      <header className="border-b-4 border-slate-900 pb-3 mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
          {personal.fullName || 'Executive Leader'}
        </h1>
        {personal.jobTitle && (
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-1">
            {personal.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 font-medium">
          {contactItems.map((item, idx) => (
            <span key={idx}>
              {item}
              {idx < contactItems.length - 1 && <span className="ml-4 text-slate-300">|</span>}
            </span>
          ))}
        </div>
      </header>

      <div className="space-y-4">
        {/* Career Objective */}
        {objective && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 leading-none">
                Career Objective
              </h2>
              <div className="h-[1.5px] w-full bg-slate-300 mt-1" />
            </div>
            <p className="text-slate-800 text-xs leading-relaxed text-left">
              {objective}
            </p>
          </section>
        )}

        {/* Executive Profile */}
        {summary && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 leading-none">
                Executive Profile
              </h2>
              <div className="h-[1.5px] w-full bg-slate-300 mt-1" />
            </div>
            <p className="text-slate-800 text-xs leading-relaxed text-left">
              {summary}
            </p>
          </section>
        )}

        {/* Executive Experience */}
        {experience && experience.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 leading-none">
                Leadership & Professional Experience
              </h2>
              <div className="h-[1.5px] w-full bg-slate-300 mt-1" />
            </div>
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
            <div className="mb-2">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 leading-none">
                Strategic Initiatives & Projects
              </h2>
              <div className="h-[1.5px] w-full bg-slate-300 mt-1" />
            </div>
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
                        <p key={i} className="leading-none">{line}</p>
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
            <div className="mb-1.5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 leading-none">
                Core Competencies & Expertise
              </h2>
              <div className="h-[1.5px] w-full bg-slate-300 mt-1" />
            </div>
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
            <div className="mb-2">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 leading-none">
                Education & Professional Development
              </h2>
              <div className="h-[1.5px] w-full bg-slate-300 mt-1" />
            </div>
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
            <div className="mb-1.5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 leading-snug">
                Certifications & Key Recognitions
              </h2>
              <div className="h-[1.5px] w-full bg-slate-300 mt-1" />
            </div>
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
