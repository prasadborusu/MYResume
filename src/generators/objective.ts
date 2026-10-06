export interface ObjectiveParams {
  role?: string;
  skills?: string[];
  experienceLevel?: 'fresher' | 'junior' | 'mid' | 'career-changer';
}

const fresherTemplates = [
  "Enthusiastic and detail-oriented {role} seeking an entry-level position to apply solid foundational knowledge in {skills}. Eager to contribute to high-impact projects while continuing to learn and grow within an innovative team.",
  "Aspiring {role} equipped with comprehensive academic training and hands-on project experience in {skills}. Looking to leverage strong problem-solving skills and passion for technology to add immediate value to organizational goals.",
  "Motivated graduate aiming to kickstart a career as a {role}. Possesses strong command over {skills} with a proven track record of academic excellence and collaborative project execution.",
  "Dedicated and quick-learning professional seeking an opportunity as a {role} where I can utilize my expertise in {skills} to develop scalable solutions and advance company initiatives.",
  "Passionate {role} eager to bridge theoretical knowledge with practical industry challenges. Strong background in {skills} with a focus on writing clean, efficient, and well-structured code."
];

const juniorTemplates = [
  "Results-driven {role} with proven ability to build dependable software solutions utilizing {skills}. Seeking an opportunity to expand technical proficiency and deliver measurable outcomes for forward-thinking engineering teams.",
  "Ambitious {role} looking to contribute hands-on experience in {skills} to drive system performance and seamless user experiences in a collaborative and fast-paced environment.",
  "Proactive {role} seeking to bring solid technical fundamentals in {skills} to an agile development team focused on building robust and modern digital products."
];

const careerChangerTemplates = [
  "Adaptable and versatile professional transitioning into the role of {role}. Combines strong analytical reasoning and communication skills with up-to-date practical expertise in {skills}.",
  "Detail-oriented professional leveraging a diverse background and rigorous training in {skills} to deliver innovative, user-centric solutions as a dedicated {role}."
];

const actionEnhancements = [
  "Consistently committed to continuous improvement, adherence to industry best practices, and effective cross-functional teamwork.",
  "Dedicated to writing high-quality maintainable code and solving complex technical challenges under tight deadlines.",
  "Demonstrated capability in rapid prototyping, analytical problem-solving, and collaborating across agile development lifecycles."
];

export function generateObjective(params: ObjectiveParams): { text: string; error?: string } {
  const role = (params.role && params.role.trim()) || "Software Developer";
  const skillsList = params.skills && params.skills.length > 0 
    ? params.skills.slice(0, 4).join(", ") 
    : "modern web technologies and software engineering principles";

  let pool = fresherTemplates;
  if (params.experienceLevel === 'junior' || params.experienceLevel === 'mid') {
    pool = [...fresherTemplates, ...juniorTemplates];
  } else if (params.experienceLevel === 'career-changer') {
    pool = careerChangerTemplates;
  }

  const selectedTemplate = pool[Math.floor(Math.random() * pool.length)];
  const result = selectedTemplate
    .replace(/{role}/g, role)
    .replace(/{skills}/g, skillsList);

  return { text: result };
}

export function improveObjective(currentText: string, role?: string): string {
  if (!currentText || currentText.trim().length < 10) {
    return generateObjective({ role }).text;
  }
  const enhancement = actionEnhancements[Math.floor(Math.random() * actionEnhancements.length)];
  
  // Polish sentences
  let cleaned = currentText.trim();
  if (!cleaned.endsWith('.')) cleaned += '.';
  
  if (!cleaned.includes("best practices") && !cleaned.includes("agile")) {
    return `${cleaned} ${enhancement}`;
  }
  
  // Reword first sentence with stronger action
  return cleaned
    .replace(/Looking to/i, "Driven to")
    .replace(/Seeking/i, "Targeting high-impact opportunities as a")
    .replace(/Eager to/i, "Equipped with strong dedication to");
}
