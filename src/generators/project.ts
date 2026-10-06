export interface ProjectGenParams {
  name?: string;
  role?: string;
  technologies?: string;
  purpose?: string;
}

const singleSentenceTemplates = [
  "Architected and deployed {projectName} using {technologies} to provide an intuitive and efficient solution for {purpose}.",
  "Engineered a responsive full-featured application ({projectName}) utilizing {technologies}, designed specifically to streamline {purpose}.",
  "Developed {projectName} with {technologies}, incorporating modern design patterns, structured state management, and robust error handling to address {purpose}.",
  "Designed and implemented {projectName} leveraging {technologies} to optimize performance, enhance user engagement, and simplify {purpose}."
];

const bulletTemplates = [
  [
    "• Architected and developed a full-featured web solution ({projectName}) utilizing {technologies}.",
    "• Implemented responsive UI components, robust error handling, and optimized state management for high availability.",
    "• Integrated streamlined data workflows to effectively solve challenges around {purpose}."
  ],
  [
    "• Built and maintained {projectName} using {technologies}, adhering to clean code standards and modular architecture.",
    "• Developed RESTful endpoints and optimized rendering pipelines, resulting in fast load times and seamless user interactions.",
    "• Addressed critical user pain points by automating {purpose} with comprehensive test coverage."
  ],
  [
    "• Designed and engineered {projectName} leveraging modern capabilities of {technologies}.",
    "• Streamlined application performance, reduced bundle size, and enhanced overall user accessibility.",
    "• Successfully delivered end-to-end functionality facilitating {purpose}."
  ]
];

export function generateProjectDescription(params: ProjectGenParams, format: 'bullets' | 'paragraph' = 'bullets'): { text: string } {
  const projectName = (params.name && params.name.trim()) || "the application";
  const technologies = (params.technologies && params.technologies.trim()) || "React, TypeScript, and modern web APIs";
  const purpose = (params.purpose && params.purpose.trim()) || "real-time data processing and user workflow automation";

  if (format === 'paragraph') {
    const template = singleSentenceTemplates[Math.floor(Math.random() * singleSentenceTemplates.length)];
    return {
      text: template
        .replace(/{projectName}/g, projectName)
        .replace(/{technologies}/g, technologies)
        .replace(/{purpose}/g, purpose)
    };
  }

  const bulletSet = bulletTemplates[Math.floor(Math.random() * bulletTemplates.length)];
  const generated = bulletSet.map(line => 
    line
      .replace(/{projectName}/g, projectName)
      .replace(/{technologies}/g, technologies)
      .replace(/{purpose}/g, purpose)
  ).join("\n");

  return { text: generated };
}

export function improveProjectDescription(currentText: string, params?: ProjectGenParams): string {
  if (!currentText || currentText.trim().length < 10) {
    return generateProjectDescription(params || {}).text;
  }

  const lines = currentText.split('\n');
  const improvedLines = lines.map(line => {
    let l = line.trim();
    if (!l) return l;
    
    // Ensure bullet format if multiple lines
    if (!l.startsWith('•') && !l.startsWith('-') && lines.length > 1) {
      l = `• ${l}`;
    }

    return l
      .replace(/Made/g, "Architected and delivered")
      .replace(/Used/g, "Leveraged")
      .replace(/Worked on/g, "Engineered core modules for")
      .replace(/Helped with/g, "Collaborated to enhance")
      .replace(/Created/g, "Designed and implemented")
      .replace(/Fixed/g, "Troubleshot and resolved");
  });

  return improvedLines.join('\n');
}
