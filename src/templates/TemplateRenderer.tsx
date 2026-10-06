import React from 'react';
import { ResumeData, TemplateId } from '../types/resume';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { AcademicTemplate } from './AcademicTemplate';
import { DeveloperTemplate } from './DeveloperTemplate';
import { TechnicalTemplate } from './TechnicalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';

interface TemplateRendererProps {
  templateId: TemplateId;
  data: ResumeData;
  className?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateId, data, className = '' }) => {
  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'academic':
        return <AcademicTemplate data={data} />;
      case 'developer':
        return <DeveloperTemplate data={data} />;
      case 'technical':
        return <TechnicalTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className={`resume-document shadow-2xl transition-all duration-200 ${className}`}>
      {renderTemplate()}
    </div>
  );
};
