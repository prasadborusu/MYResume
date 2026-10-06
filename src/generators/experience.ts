export interface ExperienceGenParams {
  position?: string;
  company?: string;
  technologies?: string;
  duties?: string;
}

const experienceBulletSets = [
  [
    "• Spearheaded development and maintenance of high-throughput web applications using {technologies}, ensuring 99.9% uptime.",
    "• Collaborated with product managers, UI/UX designers, and engineering peers to define technical requirements and deliver milestone features ahead of schedule.",
    "• Refactored legacy codebases and optimized database queries, resulting in improved page load speeds and enhanced scalability.",
    "• Actively participated in agile sprint rituals, code reviews, and architectural discussions to elevate software craftsmanship across the team."
  ],
  [
    "• Designed and deployed reusable modular components and robust backend integrations utilizing {technologies}.",
    "• Streamlined CI/CD automation pipelines, reducing deployment turnaround times and minimizing production regression bugs.",
    "• Implemented responsive frontend interfaces and verified cross-browser compatibility to provide seamless end-user experiences.",
    "• Authored comprehensive technical documentation and unit test suites to ensure long-term codebase maintainability."
  ],
  [
    "• Engineered core application features and API endpoints leveraging {technologies} to support enterprise workflows.",
    "• Identified and resolved critical performance bottlenecks, improving overall application responsiveness and client satisfaction.",
    "• Mentored junior team members and fostered collaborative peer programming practices within the engineering organization."
  ]
];

export function generateExperienceDescription(params: ExperienceGenParams): { text: string } {
  const technologies = (params.technologies && params.technologies.trim()) || "React, Node.js, and modern cloud technologies";
  const position = (params.position && params.position.trim()) || "Software Developer";
  const company = (params.company && params.company.trim()) || "the organization";

  const selectedSet = experienceBulletSets[Math.floor(Math.random() * experienceBulletSets.length)];
  const generated = selectedSet.map(bullet => 
    bullet
      .replace(/{technologies}/g, technologies)
      .replace(/{position}/g, position)
      .replace(/{company}/g, company)
  ).join("\n");

  return { text: generated };
}

export function improveExperienceDescription(currentText: string, params?: ExperienceGenParams): string {
  if (!currentText || currentText.trim().length < 10) {
    return generateExperienceDescription(params || {}).text;
  }

  const lines = currentText.split('\n');
  const improvedLines = lines.map(line => {
    let l = line.trim();
    if (!l) return l;

    if (!l.startsWith('•') && !l.startsWith('-') && lines.length > 1) {
      l = `• ${l}`;
    }

    return l
      .replace(/Handled/g, "Successfully orchestrated")
      .replace(/Worked with/g, "Partnered cross-functionally with")
      .replace(/Built/g, "Architected and delivered")
      .replace(/Managed/g, "Directed key initiatives and optimized")
      .replace(/Wrote code for/g, "Engineered production-grade solutions in");
  });

  return improvedLines.join('\n');
}
