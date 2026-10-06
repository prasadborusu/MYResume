export interface AchievementGenParams {
  title?: string;
  metric?: string;
  context?: string;
}

const achievementTemplates = [
  "Awarded {title} for outstanding problem-solving and rapid delivery of {context}.",
  "Secured 1st Place / Top Performer in {title}, outperforming 50+ participants through innovative system architecture and seamless execution.",
  "Recognized with {title} in appreciation of exceptional technical contributions, reducing process turnaround time by {metric}.",
  "Successfully completed {title}, publishing comprehensive technical solutions and mentoring peers across the community.",
  "Published insightful research/technical documentation on {title}, garnering widespread engagement and adoption across engineering circles."
];

export function generateAchievement(params: AchievementGenParams): { text: string } {
  const title = (params.title && params.title.trim()) || "Best Innovation Award / Hackathon Finalist";
  const metric = (params.metric && params.metric.trim()) || "35%";
  const context = (params.context && params.context.trim()) || "high-performance web architecture";

  const template = achievementTemplates[Math.floor(Math.random() * achievementTemplates.length)];
  return {
    text: template
      .replace(/{title}/g, title)
      .replace(/{metric}/g, metric)
      .replace(/{context}/g, context)
  };
}

export function improveAchievement(currentText: string, params?: AchievementGenParams): string {
  if (!currentText || currentText.trim().length < 10) {
    return generateAchievement(params || {}).text;
  }

  let text = currentText.trim();
  if (!text.endsWith('.')) text += '.';

  return text
    .replace(/Won/g, "Honored with 1st Prize in")
    .replace(/Got/g, "Awarded prestigious recognition for")
    .replace(/Did/g, "Executed high-impact initiatives in");
}
