import { ResumeData } from '../types/resume';

export interface CompletionSection {
  name: string;
  weight: number;
  completed: boolean;
  score: number;
}

export function calculateResumeCompletion(data?: ResumeData): { percentage: number; sections: CompletionSection[] } {
  if (!data) return { percentage: 0, sections: [] };

  const personal = data.personal || {};
  const hasPersonal = Boolean(personal.fullName && personal.email && (personal.phone || personal.location));
  const personalScore = hasPersonal ? 20 : (personal.fullName || personal.email ? 10 : 0);

  const hasSummary = Boolean((data.summary && data.summary.trim().length > 20) || (data.objective && data.objective.trim().length > 20));
  const summaryScore = hasSummary ? 10 : 0;

  const hasEducation = Boolean(data.education && data.education.length > 0 && data.education[0].institution && data.education[0].degree);
  const educationScore = hasEducation ? 15 : 0;

  const hasSkills = Boolean(data.skills && data.skills.length >= 3);
  const skillsScore = hasSkills ? 15 : (data.skills && data.skills.length > 0 ? 8 : 0);

  const hasProjects = Boolean(data.projects && data.projects.length > 0 && data.projects[0].name);
  const projectsScore = hasProjects ? 20 : 0;

  const hasExperience = Boolean(data.experience && data.experience.length > 0 && data.experience[0].company);
  const experienceScore = hasExperience ? 15 : 0;

  const hasCertOrAchieve = Boolean(
    (data.certifications && data.certifications.length > 0) ||
    (data.achievements && data.achievements.length > 0) ||
    (data.languages && data.languages.length > 0)
  );
  const certScore = hasCertOrAchieve ? 5 : 0;

  const total = Math.min(100, personalScore + summaryScore + educationScore + skillsScore + projectsScore + experienceScore + certScore);

  const sections: CompletionSection[] = [
    { name: 'Personal Details', weight: 20, completed: personalScore === 20, score: personalScore },
    { name: 'Summary / Objective', weight: 10, completed: summaryScore === 10, score: summaryScore },
    { name: 'Education', weight: 15, completed: educationScore === 15, score: educationScore },
    { name: 'Skills', weight: 15, completed: skillsScore === 15, score: skillsScore },
    { name: 'Projects', weight: 20, completed: projectsScore === 20, score: projectsScore },
    { name: 'Experience', weight: 15, completed: experienceScore === 15, score: experienceScore },
    { name: 'Certifications & Extras', weight: 5, completed: certScore === 5, score: certScore },
  ];

  return { percentage: total, sections };
}
