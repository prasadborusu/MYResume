import { ResumeData } from '../types/resume';

export const emptyResumeData: ResumeData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: ''
  },
  summary: '',
  objective: '',
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
  languages: []
};

export const sampleResumeData: ResumeData = {
  personal: {
    fullName: 'Alexander Wright',
    jobTitle: 'Full-Stack Software Engineer',
    email: 'alex.wright@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexanderwright',
    github: 'github.com/alexwright',
    portfolio: 'alexwright.dev'
  },
  summary: 'Results-driven Full-Stack Engineer with 3+ years of experience building high-throughput web applications using React, Node.js, and TypeScript. Passionate about clean modular architectures, database optimization, and intuitive user experiences.',
  objective: 'Enthusiastic and detail-oriented Software Engineer aiming to leverage technical expertise in modern web technologies to engineer scalable digital products and advance organizational innovation.',
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startYear: '2019',
      endYear: '2023',
      grade: '3.85 / 4.0 GPA',
      description: 'Dean’s Honor List (4 semesters), Coursework in Distributed Systems, Algorithms & Cloud Computing.'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript', category: 'Programming Languages', level: 'Expert' },
    { id: 'sk-2', name: 'JavaScript (ES6+)', category: 'Programming Languages', level: 'Expert' },
    { id: 'sk-3', name: 'Python', category: 'Programming Languages', level: 'Intermediate' },
    { id: 'sk-4', name: 'React', category: 'Frameworks', level: 'Expert' },
    { id: 'sk-5', name: 'Node.js / Express', category: 'Frameworks', level: 'Advanced' },
    { id: 'sk-6', name: 'Next.js', category: 'Frameworks', level: 'Advanced' },
    { id: 'sk-7', name: 'Tailwind CSS', category: 'Frameworks', level: 'Expert' },
    { id: 'sk-8', name: 'PostgreSQL', category: 'Databases', level: 'Advanced' },
    { id: 'sk-9', name: 'Redis', category: 'Databases', level: 'Intermediate' },
    { id: 'sk-10', name: 'Docker', category: 'Tools', level: 'Intermediate' },
    { id: 'sk-11', name: 'Git & GitHub Actions', category: 'Tools', level: 'Advanced' },
    { id: 'sk-12', name: 'AWS (S3, Lambda)', category: 'Tools', level: 'Intermediate' }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'PulseFlow - Task Analytics Dashboard',
      role: 'Lead Full-Stack Developer',
      technologies: 'React, TypeScript, Tailwind CSS, Node.js, PostgreSQL',
      description: '• Architected a responsive real-time analytics platform handling 10,000+ daily events.\n• Implemented optimized state management and custom charting widgets, reducing initial render latency by 40%.\n• Integrated automated CI/CD deployment workflows with 95% unit test coverage.',
      projectUrl: 'https://pulseflow-demo.io',
      githubUrl: 'https://github.com/alexwright/pulseflow'
    },
    {
      id: 'proj-2',
      name: 'CloudSync - Distributed File Sharing',
      role: 'Backend & Systems Engineer',
      technologies: 'Node.js, Express, AWS S3, Redis, WebSockets',
      description: '• Engineered an end-to-end encrypted file synchronization protocol supporting chunked uploads up to 2GB.\n• Designed Redis pub/sub channels to broadcast live file revision updates across active connected clients.',
      projectUrl: '',
      githubUrl: 'https://github.com/alexwright/cloudsync'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Digital Solutions',
      position: 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jul 2023',
      endDate: 'Present',
      isCurrent: true,
      description: '• Developed high-traffic web components using React and TypeScript, serving over 150,000 monthly active users.\n• Collaborated closely with product designers and backend engineers to launch 6 major core platform features.\n• Refactored core API endpoints, improving data retrieval response times by 32%.'
    },
    {
      id: 'exp-2',
      company: 'Innovate Labs',
      position: 'Software Engineering Intern',
      location: 'San Jose, CA',
      startDate: 'Jun 2022',
      endDate: 'Sep 2022',
      isCurrent: false,
      description: '• Built internal dashboard tools for automated metric visualization and anomaly detection.\n• Wrote comprehensive Jest and Cypress test suites, decreasing regression bug reports by 25%.'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2024',
      credentialUrl: 'https://aws.amazon.com'
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      date: '2023',
      credentialUrl: 'https://coursera.org'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: '1st Place – CalHacks Hackathon',
      description: 'Built an AI-powered accessibility reading assistant among 300+ competing international university teams.'
    },
    {
      id: 'ach-2',
      title: 'Open Source Contributor',
      description: 'Contributed multiple performance patches and documentation improvements to popular React component repositories.'
    }
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native' },
    { id: 'lang-2', language: 'Spanish', proficiency: 'Intermediate' }
  ]
};
