import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/Icons';

interface TemplateProps {
  data: ResumeData;
}

export const TechnicalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, summary, objective, education, skills, projects, experience, certifications, achievements, languages } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other Technical Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans p-8 md:p-10 leading-normal text-[12.5px] print:p-0 print:text-[11.5px] min-h-[1123px] box-border">
      {/* Technical Header */}
      <header className="border-b-2 border-cyan-800 pb-3.5 mb-4">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 uppercase">
              {personal.fullName || 'Candidate Name'}
            </h1>
            {personal.jobTitle && (
              <p className="text-xs font-bold text-cyan-800 tracking-wider uppercase mt-0.5">
                {personal.jobTitle}
              </p>
            )}
          </div>

          {/* Contact details */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-600">
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-700" /> {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-700" /> {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-700" /> {personal.location}
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedinIcon className="w-3.5 h-3.5 text-cyan-700" /> {personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            )}
            {personal.github && (
              <span className="flex items-center gap-1">
                <GithubIcon className="w-3.5 h-3.5 text-cyan-700" /> {personal.github.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            )}
            {personal.portfolio && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-700" /> {personal.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-3.5">
        {/* Career Objective */}
        {objective && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                Career Objective
              </h2>
              <div className="h-[1px] w-full bg-zinc-300 mt-1" />
            </div>
            <p className="text-zinc-700 text-xs leading-relaxed text-left">
              {objective}
            </p>
          </section>
        )}

        {/* Technical Summary */}
        {summary && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                Technical Summary
              </h2>
              <div className="h-[1px] w-full bg-zinc-300 mt-1" />
            </div>
            <p className="text-zinc-700 text-xs leading-relaxed text-left">
              {summary}
            </p>
          </section>
        )}

        {/* Technical Competencies Grid */}
        {skills && skills.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 bg-cyan-700 rounded-full" />
                Core Competencies & Skills
              </h2>
              <div className="h-[1px] w-full bg-zinc-300 mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {Object.entries(groupedSkills).map(([cat, items]) => (
                <div key={cat} className="flex items-baseline gap-1">
                  <span className="font-semibold text-zinc-900 shrink-0">{cat}:</span>
                  <span className="text-zinc-700">{items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Engineering Experience */}
        {experience && experience.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 bg-cyan-700 rounded-full" />
                Engineering Experience
              </h2>
              <div className="h-[1px] w-full bg-zinc-300 mt-1" />
            </div>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-zinc-950 text-xs">{exp.position}</span>
                    <span className="text-xs text-zinc-500 font-medium">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} {exp.location && `| ${exp.location}`}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-cyan-900">{exp.company}</p>
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

        {/* Technical Projects */}
        {projects && projects.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 bg-cyan-700 rounded-full" />
                Systems & Software Projects
              </h2>
              <div className="h-[1px] w-full bg-zinc-300 mt-1" />
            </div>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-zinc-950 text-xs">{proj.name} {proj.role && <span className="font-normal text-zinc-600 italic">({proj.role})</span>}</span>
                    {proj.githubUrl && <span className="text-xs text-cyan-700">{proj.githubUrl.replace(/^https?:\/\//, '')}</span>}
                  </div>
                  {proj.technologies && (
                    <p className="text-[11px] text-zinc-600 font-medium">
                      <span className="text-zinc-500">Tech:</span> {proj.technologies}
                    </p>
                  )}
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

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 bg-cyan-700 rounded-full" />
                Education
              </h2>
              <div className="h-[1px] w-full bg-zinc-300 mt-1" />
            </div>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline flex-wrap">
                  <div>
                    <span className="font-bold text-zinc-950">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                    <p className="text-xs text-zinc-700">{edu.institution} {edu.grade && <span className="text-zinc-500 font-medium">({edu.grade})</span>}</p>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">{edu.startYear} – {edu.endYear || 'Present'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0) || (languages && languages.length > 0)) && (
          <section>
            <div className="mb-2">
              <h2 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 bg-cyan-700 rounded-full" />
                Certifications & Highlights
              </h2>
              <div className="h-[1px] w-full bg-zinc-300 mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-zinc-700">
              {certifications?.map((c) => (
                <div key={c.id}>
                  <strong>{c.name}</strong> — {c.issuer} ({c.date})
                </div>
              ))}
              {achievements?.map((a) => (
                <div key={a.id}>
                  <strong>{a.title}:</strong> {a.description}
                </div>
              ))}
              {languages && languages.length > 0 && (
                <div className="col-span-full">
                  <strong>Languages:</strong> {languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
