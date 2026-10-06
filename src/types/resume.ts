export type TemplateId = 'modern' | 'minimal' | 'classic' | 'professional' | 'academic' | 'developer' | 'technical' | 'executive';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  grade: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Programming Languages' | 'Frameworks' | 'Tools' | 'Databases' | 'Other Skills';
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  technologies: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  objective: string;
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
}

export interface ResumeRecord {
  id: string;
  user_id: string;
  title: string;
  template_id: TemplateId;
  resume_data: ResumeData;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  tag: string;
  category: 'Modern' | 'Minimal' | 'Classic' | 'Academic' | 'Developer' | 'Professional';
  accentColor: string;
  recommendedFor: string;
}
