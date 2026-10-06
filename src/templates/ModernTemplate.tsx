import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/Icons';

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, summary, objective, education, skills, projects, experience, certifications, achievements, languages } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans p-8 md:p-10 leading-relaxed text-[13px] print:p-0 print:text-[12px] min-h-[1050px]">
      {/* Header Banner */}
      <header className="border-b-2 border-zinc-900 pb-5 mb-5">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 uppercase">
          {personal.fullName || 'Your Full Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-sm font-semibold text-zinc-700 mt-0.5 tracking-wide uppercase">
            {personal.jobTitle}
          </p>
        )}

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-zinc-600">
          {personal.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-zinc-800" />
              <span>{personal.email}</span>
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-zinc-800" />
              <span>{personal.phone}</span>
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-800" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.linkedin && (
            <span className="flex items-center gap-1">
              <LinkedinIcon className="w-3.5 h-3.5 text-zinc-800" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </span>
          )}
          {personal.github && (
            <span className="flex items-center gap-1">
              <GithubIcon className="w-3.5 h-3.5 text-zinc-800" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </span>
          )}
          {personal.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-zinc-800" />
              <span>{personal.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Career Objective */}
        {objective && (
          <section>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5 pb-0.5 border-b border-zinc-300">
              Career Objective
            </h2>
            <p className="text-zinc-700 whitespace-pre-line text-left leading-normal">
              {objective}
            </p>
          </section>
        )}

        {/* Professional Summary */}
        {summary && (
          <section>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5 pb-0.5 border-b border-zinc-300">
              Professional Summary
            </h2>
            <p className="text-zinc-700 whitespace-pre-line text-left leading-normal">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 pb-0.5 border-b border-zinc-300">
              Work Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div>
                      <span className="font-bold text-zinc-900">{exp.position}</span>
                      {exp.company && <span className="text-zinc-700"> — <span className="font-semibold text-zinc-800">{exp.company}</span></span>}
                    </div>
                    <span className="text-xs text-zinc-500 font-medium">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} {exp.location && `| ${exp.location}`}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-zinc-700 mt-1 whitespace-pre-line space-y-0.5">
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
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 pb-0.5 border-b border-zinc-300">
              Key Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{proj.name}</span>
                      {proj.role && <span className="text-xs text-zinc-500 italic">({proj.role})</span>}
                    </div>
                    <div className="text-xs text-zinc-600 flex gap-2">
                      {proj.githubUrl && <span>{proj.githubUrl.replace(/^https?:\/\//, '')}</span>}
                      {proj.projectUrl && <span>{proj.projectUrl.replace(/^https?:\/\//, '')}</span>}
                    </div>
                  </div>
                  {proj.technologies && (
                    <p className="text-xs text-zinc-600 font-medium">
                      <span className="text-zinc-500">Tech Stack:</span> {proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <div className="text-zinc-700 mt-0.5 whitespace-pre-line space-y-0.5">
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
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 pb-0.5 border-b border-zinc-300">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline flex-wrap gap-1">
                  <div>
                    <span className="font-bold text-zinc-900">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </span>
                    <p className="text-zinc-700">{edu.institution} {edu.grade && <span className="text-xs text-zinc-500 font-medium">({edu.grade})</span>}</p>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">
                    {edu.startYear} – {edu.endYear || 'Present'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 pb-0.5 border-b border-zinc-300">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {Object.entries(groupedSkills).map(([cat, items]) => (
                <div key={cat} className="flex items-baseline gap-1">
                  <span className="font-semibold text-zinc-800 shrink-0">{cat}:</span>
                  <span className="text-zinc-700">{items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements in 2 columns */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0) || (languages && languages.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {certifications && certifications.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5 pb-0.5 border-b border-zinc-300">
                  Certifications
                </h2>
                <ul className="space-y-1 text-xs text-zinc-700">
                  {certifications.map((cert) => (
                    <li key={cert.id} className="flex justify-between">
                      <span className="font-medium text-zinc-900">{cert.name} <span className="text-zinc-500 font-normal">({cert.issuer})</span></span>
                      <span className="text-zinc-500 shrink-0 ml-2">{cert.date}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {achievements && achievements.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5 pb-0.5 border-b border-zinc-300">
                  Key Achievements
                </h2>
                <ul className="space-y-1 text-xs text-zinc-700">
                  {achievements.map((ach) => (
                    <li key={ach.id}>
                      <span className="font-semibold text-zinc-900">{ach.title}: </span>
                      <span>{ach.description}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {languages && languages.length > 0 && (
              <section className="col-span-full">
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5 pb-0.5 border-b border-zinc-300">
                  Languages
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-zinc-700">
                  {languages.map((lang) => (
                    <span key={lang.id}>
                      <strong className="text-zinc-900">{lang.language}</strong>: <span className="text-zinc-600">{lang.proficiency}</span>
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
