import React, { useRef, useState, useEffect } from 'react';
import { TemplateId } from '../../types/resume';
import { sampleResumeData } from '../../utils/initialData';
import { TemplateRenderer } from '../../templates/TemplateRenderer';

interface TemplateThumbnailProps {
  templateId: TemplateId;
  className?: string;
  onPreviewClick?: () => void;
}

const BASE_WIDTH = 794; // Standard A4 pixel width
const BASE_HEIGHT = 1123; // Standard A4 pixel height (210 / 297 ratio)

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  templateId,
  className = '',
  onPreviewClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerWidth(rect.width);
        }
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Horizontal padding: 8px on each side (16px total) so resume uses ~95% of card width
  const horizontalPadding = 16;
  const availableWidth = containerWidth > 0 ? Math.max(containerWidth - horizontalPadding, 220) : 340;
  const scale = availableWidth / BASE_WIDTH;
  const scaledHeight = BASE_HEIGHT * scale;

  return (
    <div
      ref={containerRef}
      onClick={onPreviewClick}
      className={`relative w-full h-[380px] sm:h-[420px] md:h-[450px] bg-[#0A0A0D] border-b border-zinc-800/90 overflow-hidden flex flex-col items-center pt-3 pb-0 px-2 cursor-pointer select-none group/thumb ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Resume Scaled Wrapper filling ~95% card width */}
      <div
        className="relative mx-auto overflow-hidden rounded-t shadow-2xl transition-transform duration-200"
        style={{
          width: `${availableWidth}px`,
          height: `${Math.min(scaledHeight, 440)}px`,
          boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)'
        }}
      >
        {/* Rendered A4 Document Scaled Proportionally to fill exact available width */}
        <div
          className="bg-white text-zinc-900 pointer-events-none select-none"
          style={{
            width: `${BASE_WIDTH}px`,
            minHeight: `${BASE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <TemplateRenderer
            templateId={templateId}
            data={sampleResumeData}
          />
        </div>
      </div>

      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
};

