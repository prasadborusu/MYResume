export interface SummaryParams {
  role?: string;
  yearsExp?: string;
  topSkills?: string[];
  domain?: string;
}

const summaryTemplates = [
  "Dynamic and analytical {role} with expertise in {skills}. Experienced in designing and implementing performant solutions, following clean architecture guidelines, and collaborating with cross-functional teams to build reliable products.",
  "Proficient {role} knowledgeable in {skills}. Adept at translating complex requirements into elegant, user-friendly digital experiences while ensuring high code standards and system stability.",
  "Goal-oriented {role} with hands-on proficiency in {skills}. Proven ability to rapidly assimilate emerging technologies, optimize workflow efficiencies, and deliver robust software solutions on schedule.",
  "Creative and detail-driven {role} possessing deep foundation in {skills}. Dedicated to developing scalable web architectures, resolving technical bottlenecks, and enhancing overall user satisfaction.",
  "Committed {role} with solid proficiency across {skills}. Skilled at end-to-end development, debugging, and continuous integration, with a strong focus on maintainability and performance."
];

const summaryExpTemplates = [
  "Seasoned {role} with {years} of progressive experience architecting resilient software systems using {skills}. Demonstrated track record of boosting system reliability and driving agile engineering practices.",
  "Accomplished {role} with over {years} delivering high-impact solutions across {skills}. Recognized for technical mentorship, architectural cleanliness, and driving measurable team outcomes."
];

export function generateSummary(params: SummaryParams): { text: string; error?: string } {
  const role = (params.role && params.role.trim()) || "Software Engineer";
  const skillsList = params.topSkills && params.topSkills.length > 0 
    ? params.topSkills.slice(0, 5).join(", ") 
    : "full-stack development, modern frameworks, and responsive design";
  
  if (params.yearsExp && parseInt(params.yearsExp, 10) > 0) {
    const template = summaryExpTemplates[Math.floor(Math.random() * summaryExpTemplates.length)];
    return {
      text: template
        .replace(/{role}/g, role)
        .replace(/{years}/g, `${params.yearsExp}+ years`)
        .replace(/{skills}/g, skillsList)
    };
  }

  const template = summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
  return {
    text: template
      .replace(/{role}/g, role)
      .replace(/{skills}/g, skillsList)
  };
}

export function improveSummary(currentText: string, role?: string): string {
  if (!currentText || currentText.trim().length < 15) {
    return generateSummary({ role }).text;
  }
  
  const endings = [
    "Known for strong problem-solving acumen, analytical thinking, and seamless cross-functional collaboration.",
    "Adept at agile methodologies, automated testing, and delivering scalable applications under demanding timelines.",
    "Dedicated to engineering excellence, maintainable codebases, and continuous architectural optimization."
  ];

  let text = currentText.trim();
  if (!text.endsWith('.')) text += '.';
  
  const selectedEnding = endings[Math.floor(Math.random() * endings.length)];
  if (!text.includes("collaboration") && !text.includes("excellence")) {
    return `${text} ${selectedEnding}`;
  }

  return text
    .replace(/Good at/i, "Proficient in")
    .replace(/Worked on/i, "Successfully engineered")
    .replace(/Responsible for/i, "Spearheaded key initiatives in");
}
