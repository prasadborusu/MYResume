import React from 'react';
import { ResumeData } from '../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
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
    personal.github ? personal.github.replace(/^https?:\/\/(www\.)?/, '') : '',
    personal.portfolio ? personal.portfolio.replace(/^https?:\/\/(www\.)?/, '') : ''
  ].filter(Boolean);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans p-8 md:p-10 leading-normal text-[12.5px] print:p-0 print:text-[12px] min-h-[1050px]">
      {/* Header */}
      <header className="text-center pb-4 mb-4 border-b border-zinc-300">
        <h1 className="text-2xl font-bold tracking-normal text-zinc-950">
          {personal.fullName || 'Your Full Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-xs font-medium text-zinc-600 mt-0.5">
            {personal.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-xs text-zinc-600">
          {contactItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < contactItems.length - 1 && <span className="text-zinc-400">•</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className="space-y-3.5">
        {/* Career Objective */}
        {objective && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Career Objective
            </h2>
            <p className="text-zinc-700 leading-relaxed text-left">
              {objective}
            </p>
          </section>
        )}

        {/* Professional Summary */}
        {summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-zinc-700 leading-relaxed text-left">
              {summary}
            </p>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline flex-wrap">
                  <div>
                    <span className="font-semibold text-zinc-950">{edu.institution}</span>
                    <p className="text-zinc-700">
                      {edu.degree} {edu.fieldOfStudy ? `— ${edu.fieldOfStudy}` : ''} {edu.grade && <span className="text-zinc-500">({edu.grade})</span>}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {edu.startYear} – {edu.endYear || 'Present'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-2">
              Experience
            </h2>
            <div className="space-y-2.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <div>
                      <span className="font-semibold text-zinc-950">{exp.position}</span>
                      {exp.company && <span className="text-zinc-700">, {exp.company}</span>}
                    </div>
                    <span className="text-xs text-zinc-500">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} {exp.location && `| ${exp.location}`}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-zinc-700 mt-1 whitespace-pre-line space-y-0.5">
                      {exp.description.split('\n').map((line, i) => (
                        <p key={i} className="leading-relaxed">{line}</p>
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-2">
              Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <div>
                      <span className="font-semibold text-zinc-950">{proj.name}</span>
                      {proj.technologies && <span className="text-zinc-600 text-xs"> | {proj.technologies}</span>}
                    </div>
                    {proj.githubUrl && (
                      <span className="text-xs text-zinc-500">{proj.githubUrl.replace(/^https?:\/\//, '')}</span>
                    )}
                  </div>
                  {proj.description && (
                    <div className="text-zinc-700 mt-0.5 whitespace-pre-line space-y-0.5">
                      {proj.description.split('\n').map((line, i) => (
                        <p key={i} className="leading-relaxed">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Technical Skills
            </h2>
            <div className="space-y-1 text-xs">
              {Object.entries(groupedSkills).map(([cat, items]) => (
                <p key={cat} className="text-zinc-700">
                  <strong className="text-zinc-900 font-semibold">{cat}:</strong> {items.join(', ')}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Certifications & Honors
            </h2>
            <ul className="space-y-1 text-xs text-zinc-700">
              {certifications?.map((c) => (
                <li key={c.id}>
                  <span className="font-medium text-zinc-900">{c.name}</span> — {c.issuer} ({c.date})
                </li>
              ))}
              {achievements?.map((a) => (
                <li key={a.id}>
                  <strong className="text-zinc-900">{a.title}:</strong> {a.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-1">
              Languages
            </h2>
            <p className="text-xs text-zinc-700">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
