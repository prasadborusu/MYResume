import React from 'react';
import { ResumeData } from '../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, summary, objective, education, skills, projects, experience, certifications, achievements, languages } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Specialized Competencies';
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
    <div className="w-full bg-white text-zinc-900 font-serif p-10 leading-relaxed text-[12.5px] min-h-[297mm] box-border">
      {/* Header */}
      <header className="border-b-2 border-indigo-900 pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-950 uppercase font-serif">
          {personal.fullName || 'Candidate Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-xs font-serif italic text-zinc-700 mt-0.5">
            {personal.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-zinc-600 font-sans">
          {contactItems.map((item, idx) => (
            <span key={idx}>
              {item}
              {idx < contactItems.length - 1 && <span className="ml-4 text-zinc-400">|</span>}
            </span>
          ))}
        </div>
      </header>

      <div className="space-y-3.5">
        {/* Career / Academic Objective */}
        {objective && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Academic Objective
              </h2>
              <div className="h-[1px] w-full bg-zinc-200 mt-1" />
            </div>
            <p className="text-zinc-800 leading-relaxed text-left text-xs">
              {objective}
            </p>
          </section>
        )}

        {/* Academic Profile / Summary */}
        {summary && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif leading-none">
                Research & Academic Profile
              </h2>
              <div className="h-[1px] w-full bg-zinc-200 mt-1" />
            </div>
            <p className="text-zinc-800 leading-relaxed text-left text-xs">
              {summary}
            </p>
          </section>
        )}

        {/* Education (Placed high for academic CV) */}
        {education && education.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 font-serif leading-none">
                Education & Qualifications
              </h2>
              <div className="h-[1px] w-full bg-indigo-200 mt-1" />
            </div>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-zinc-950">
                    <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                    <span className="text-zinc-600 font-normal italic">{edu.startYear} – {edu.endYear || 'Present'}</span>
                  </div>
                  <p className="text-indigo-900 font-medium">{edu.institution} {edu.grade && <span className="text-zinc-600 font-normal">| Grade / GPA: {edu.grade}</span>}</p>
                  {edu.description && <p className="text-zinc-700 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Research Work */}
        {projects && projects.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 font-serif leading-none">
                Academic Projects & Research
              </h2>
              <div className="h-[1px] w-full bg-indigo-200 mt-1" />
            </div>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-zinc-950">
                    <span>{proj.name} {proj.role && <span className="font-normal italic text-zinc-600">({proj.role})</span>}</span>
                    {proj.githubUrl && <span className="text-indigo-700 font-normal">{proj.githubUrl.replace(/^https?:\/\//, '')}</span>}
                  </div>
                  {proj.technologies && <p className="text-zinc-600 italic">Methodology / Tools: {proj.technologies}</p>}
                  {proj.description && (
                    <div className="text-zinc-800 mt-0.5 whitespace-pre-line space-y-0.5">
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

        {/* Professional / Teaching Experience */}
        {experience && experience.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 font-serif leading-none">
                Teaching & Professional Appointments
              </h2>
              <div className="h-[1px] w-full bg-indigo-200 mt-1" />
            </div>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-zinc-950">
                    <span>{exp.position}</span>
                    <span className="text-zinc-600 font-normal italic">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}</span>
                  </div>
                  <p className="text-indigo-900 font-medium">{exp.company} {exp.location && <span className="text-zinc-600 font-normal">| {exp.location}</span>}</p>
                  {exp.description && (
                    <div className="text-zinc-800 mt-1 whitespace-pre-line space-y-0.5">
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

        {/* Technical & Analytical Skills */}
        {skills && skills.length > 0 && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 font-serif leading-none">
                Technical & Methodological Competencies
              </h2>
              <div className="h-[1px] w-full bg-indigo-200 mt-1" />
            </div>
            <div className="space-y-1 text-xs text-zinc-800">
              {Object.entries(groupedSkills).map(([cat, items]) => (
                <p key={cat}>
                  <strong className="text-indigo-950 font-semibold">{cat}:</strong> {items.join(', ')}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Publications, Honors & Certifications */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 font-serif leading-none">
                Honors, Awards & Certifications
              </h2>
              <div className="h-[1px] w-full bg-indigo-200 mt-1" />
            </div>
            <ul className="space-y-1 text-xs text-zinc-800 list-disc list-inside">
              {achievements?.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}:</strong> {a.description}
                </li>
              ))}
              {certifications?.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong>, issued by {c.issuer} ({c.date})
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <div className="mb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 font-serif leading-snug">
                Language Proficiencies
              </h2>
              <div className="h-[1px] w-full bg-indigo-200 mt-1" />
            </div>
            <p className="text-xs text-zinc-800">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join('; ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
