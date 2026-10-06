import React from 'react';
import { ResumeData } from '../types/resume';
import { Terminal, Globe, Mail, Phone, MapPin, ExternalLink, Code } from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';

interface TemplateProps {
  data: ResumeData;
}

export const DeveloperTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, summary, objective, education, skills, projects, experience, certifications, achievements, languages } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans p-8 md:p-10 leading-normal text-[12.5px] print:p-0 print:text-[11.5px] min-h-[1050px]">
      {/* Developer Header */}
      <header className="border-b-2 border-zinc-800 pb-4 mb-4">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-sky-600 shrink-0" />
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-mono">
                {personal.fullName || 'Developer_Name'}
              </h1>
            </div>
            {personal.jobTitle && (
              <p className="text-xs font-semibold text-sky-700 font-mono mt-0.5">
                $ role: "{personal.jobTitle}"
              </p>
            )}
          </div>

          {/* Contact Badges */}
          <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-700">
            {personal.email && (
              <span className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300">
                <Mail className="w-3 h-3 text-sky-600" /> {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300">
                <Phone className="w-3 h-3 text-sky-600" /> {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300">
                <MapPin className="w-3 h-3 text-sky-600" /> {personal.location}
              </span>
            )}
            {personal.github && (
              <span className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300 text-sky-800">
                <GithubIcon className="w-3 h-3" /> {personal.github.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            )}
            {personal.portfolio && (
              <span className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300 text-sky-800">
                <Globe className="w-3 h-3" /> {personal.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-3.5">
        {/* Objective */}
        {objective && (
          <section>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5 uppercase">
              <span className="text-zinc-500">//</span> 01. Career Objective
            </div>
            <p className="text-zinc-700 text-xs leading-relaxed text-left">
              {objective}
            </p>
          </section>
        )}

        {/* Summary */}
        {summary && (
          <section>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5 uppercase">
              <span className="text-zinc-500">//</span> 02. Professional Overview
            </div>
            <p className="text-zinc-700 text-xs leading-relaxed text-left">
              {summary}
            </p>
          </section>
        )}

        {/* Technical Stack / Skills Matrix */}
        {skills && skills.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2 uppercase">
              <span className="text-sky-600">//</span> 02. Technical Skills Matrix
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {Object.entries(groupedSkills).map(([cat, items]) => (
                <div key={cat} className="p-2 bg-zinc-50 border border-zinc-200 rounded">
                  <span className="font-mono text-[11px] font-bold text-sky-800 block mb-1">
                    # {cat}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {items.map((skill, idx) => (
                      <span key={idx} className="bg-white border border-zinc-300 text-zinc-800 px-1.5 py-0.5 rounded text-[11px] font-medium font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects (Tech Showcase) */}
        {projects && projects.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2 uppercase">
              <span className="text-sky-600">//</span> 03. Featured Projects
            </div>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-950 font-mono">{proj.name}</span>
                      {proj.role && <span className="text-[11px] text-zinc-500 font-sans">({proj.role})</span>}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-sky-700">
                      {proj.githubUrl && (
                        <span className="flex items-center gap-0.5">
                          <GithubIcon className="w-3 h-3" /> {proj.githubUrl.replace(/^https?:\/\//, '')}
                        </span>
                      )}
                      {proj.projectUrl && (
                        <span className="flex items-center gap-0.5">
                          <ExternalLink className="w-3 h-3" /> live
                        </span>
                      )}
                    </div>
                  </div>
                  {proj.technologies && (
                    <div className="flex items-center gap-1 my-0.5">
                      <Code className="w-3 h-3 text-zinc-400" />
                      <span className="font-mono text-[11px] text-zinc-600">stack: [{proj.technologies}]</span>
                    </div>
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

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2 uppercase">
              <span className="text-sky-600">//</span> 04. Work Experience
            </div>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-zinc-950">{exp.position} @ <span className="text-sky-800">{exp.company}</span></span>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} {exp.location && `[${exp.location}]`}
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

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2 uppercase">
              <span className="text-sky-600">//</span> 05. Education
            </div>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs flex-wrap">
                  <div>
                    <span className="font-bold text-zinc-950">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                    <p className="text-zinc-600">{edu.institution} {edu.grade && `(Grade: ${edu.grade})`}</p>
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px]">{edu.startYear} – {edu.endYear || 'Present'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0) || (languages && languages.length > 0)) && (
          <section>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5 uppercase">
              <span className="text-sky-600">//</span> 06. Credentials & Extras
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {certifications?.map((c) => (
                <div key={c.id} className="text-zinc-700">
                  <span className="font-semibold text-zinc-900">{c.name}</span> — {c.issuer} ({c.date})
                </div>
              ))}
              {achievements?.map((a) => (
                <div key={a.id} className="text-zinc-700">
                  <strong className="text-zinc-900 font-mono">{a.title}:</strong> {a.description}
                </div>
              ))}
              {languages && languages.length > 0 && (
                <div className="col-span-full font-mono text-[11px] text-zinc-600">
                  languages: [{languages.map(l => `"${l.language} (${l.proficiency})"`).join(', ')}]
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
