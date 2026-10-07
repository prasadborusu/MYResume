import React from 'react';
import { ResumeData } from '../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, summary, objective, education, skills, projects, experience, certifications, achievements, languages } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other Skills';
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
    <div className="w-full bg-white text-zinc-900 font-serif p-8 md:p-10 leading-normal text-[12.5px] print:p-0 print:text-[12px] min-h-[1123px] box-border">
      {/* Centered Classic Header */}
      <header className="text-center pb-3 mb-4 border-b-2 border-zinc-800">
        <h1 className="text-2xl font-bold tracking-wide text-zinc-950 uppercase font-serif">
          {personal.fullName || 'Your Full Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-xs font-serif italic text-zinc-700 mt-0.5">
            {personal.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-xs text-zinc-700">
          {contactItems.map((item, idx) => (
            <span key={idx}>
              {item}
              {idx < contactItems.length - 1 && <span className="mx-1 text-zinc-400">|</span>}
            </span>
          ))}
        </div>
      </header>

      <div className="space-y-3.5">
        {/* Career Objective */}
        {objective && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Career Objective
              </h2>
              <div className="h-[1px] w-full bg-zinc-400 mt-1" />
            </div>
            <p className="text-zinc-800 leading-relaxed text-left text-xs">
              {objective}
            </p>
          </section>
        )}

        {/* Executive / Professional Summary */}
        {summary && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Executive Summary
              </h2>
              <div className="h-[1px] w-full bg-zinc-400 mt-1" />
            </div>
            <p className="text-zinc-800 leading-relaxed text-left text-xs">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Professional Experience
              </h2>
              <div className="h-[1px] w-full bg-zinc-400 mt-1" />
            </div>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <div>
                      <span className="font-bold text-zinc-950">{exp.position}</span>
                      {exp.company && <span className="text-zinc-800"> — {exp.company}</span>}
                    </div>
                    <span className="text-xs text-zinc-600 italic">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} {exp.location && `| ${exp.location}`}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-zinc-800 mt-1 text-xs whitespace-pre-line space-y-0.5">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Key Projects
              </h2>
              <div className="h-[1px] w-full bg-zinc-400 mt-1" />
            </div>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-zinc-950">{proj.name} {proj.role && <span className="font-normal italic text-zinc-600">({proj.role})</span>}</span>
                    {proj.technologies && <span className="text-xs text-zinc-600 italic">Tools: {proj.technologies}</span>}
                  </div>
                  {proj.description && (
                    <div className="text-zinc-800 mt-0.5 text-xs whitespace-pre-line space-y-0.5">
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

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Education
              </h2>
              <div className="h-[1px] w-full bg-zinc-400 mt-1" />
            </div>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline flex-wrap">
                  <div>
                    <span className="font-bold text-zinc-950">{edu.institution}</span>
                    <p className="text-xs text-zinc-800">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''} {edu.grade && <span className="text-zinc-600 font-medium">({edu.grade})</span>}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-600 italic">
                    {edu.startYear} – {edu.endYear || 'Present'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical & Core Skills */}
        {skills && skills.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Skills & Expertise
              </h2>
              <div className="h-[1px] w-full bg-zinc-400 mt-1" />
            </div>
            <div className="space-y-1 text-xs text-zinc-800">
              {Object.entries(groupedSkills).map(([cat, items]) => (
                <p key={cat}>
                  <strong className="text-zinc-950 font-semibold">{cat}:</strong> {items.join(', ')}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Honors & Certifications */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Honors & Certifications
              </h2>
              <div className="h-[1px] w-full bg-zinc-400 mt-1" />
            </div>
            <ul className="space-y-1 text-xs text-zinc-800 list-disc list-inside">
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
            </ul>
          </section>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Languages
              </h2>
              <div className="h-[1px] w-full bg-zinc-400 mt-1" />
            </div>
            <p className="text-xs text-zinc-800">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
