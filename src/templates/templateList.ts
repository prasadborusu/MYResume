import { TemplateMetadata } from '../types/resume';

export const TEMPLATES: TemplateMetadata[] = [
  {
    id: 'modern',
    name: 'Modern',
    tag: 'TECH & PRODUCT',
    category: 'Modern',
    description: 'Contemporary two-column professional resume layout with crisp typography and subtle colored accent.',
    accentColor: '#2563EB',
    recommendedFor: 'Software Engineers, Product Managers, UI/UX Designers'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tag: 'ATS OPTIMIZED',
    category: 'Minimal',
    description: 'Ultra-clean single column layout with generous white space and strict ATS compliance. Highly readable by parsing algorithms.',
    accentColor: '#18181B',
    recommendedFor: 'Freshers, Data Analysts, Graduate Applicants'
  },
  {
    id: 'classic',
    name: 'Classic',
    tag: 'EXECUTIVE',
    category: 'Classic',
    description: 'Timeless traditional format with serif headers and refined horizontal rule dividers. Perfect for corporate and enterprise jobs.',
    accentColor: '#1E293B',
    recommendedFor: 'Consulting, Finance, Legal, Operations'
  },
  {
    id: 'professional',
    name: 'Professional',
    tag: 'CORPORATE',
    category: 'Professional',
    description: 'Two-column layout featuring a dedicated sidebar for contact, education, and skills alongside an expansive experience timeline.',
    accentColor: '#0F766E',
    recommendedFor: 'Mid-Senior Engineers, Business Analysts, Managers'
  },
  {
    id: 'academic',
    name: 'Academic',
    tag: 'RESEARCH & CV',
    category: 'Academic',
    description: 'Structured CV-style template tailored for academia, publications, coursework, and honors with formal structure.',
    accentColor: '#4338CA',
    recommendedFor: 'Master/PhD Students, Researchers, Educators'
  },
  {
    id: 'developer',
    name: 'Developer',
    tag: 'TECH STACK',
    category: 'Developer',
    description: 'Engineered specifically for coders with tech stack badges, GitHub project links, and compact high-density skill blocks.',
    accentColor: '#0284C7',
    recommendedFor: 'Full-Stack Developers, DevOps, Frontend/Backend Specialists'
  },
  {
    id: 'technical',
    name: 'Technical',
    tag: 'ENGINEERING',
    category: 'Developer',
    description: 'Structured engineering format prioritizing core competencies, systems architecture, technical tools, and implementation metrics.',
    accentColor: '#0891B2',
    recommendedFor: 'Systems Engineers, Cloud Architects, Technical Leads'
  },
  {
    id: 'executive',
    name: 'Executive',
    tag: 'LEADERSHIP',
    category: 'Classic',
    description: 'Authoritative leadership format highlighting strategic initiatives, executive milestones, career progression, and business impact.',
    accentColor: '#0F172A',
    recommendedFor: 'Directors, Senior Managers, Executives, Team Leads'
  }
];
