// ─────────────────────────────────────────────────────────────
// Site copy that isn't experience/press data.
// Edit text here; the JolieOS apps read from this file.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Jolie Goldstein',
  role: 'Full-Stack Developer · UX & HCI Research',
  tagline:
    'I love the full life cycle of software, from the first idea to testing it with the people who will use it. I design it and I build it.',
  // One line a recruiter can read in two seconds: school, year, what I want
  school: 'Computer Science at Lehigh University · Class of 2028',
  availability: 'Available for Summer 2027 internships',
  email: 'joliegoldstein@icloud.com',
}

export const links = {
  github: 'https://github.com/jog228',
  linkedin: 'https://www.linkedin.com/in/joliegoldstein/',
  resume:
    'https://docs.google.com/document/d/1jzacYHi_gtQHhQGxOOgZJ5mUwtqrAxjRL5qnE8Ic4N4/preview',
  email: `mailto:${profile.email}`,
}

// Three proof points shown on the Welcome window. Each opens the window
// that backs it up, so nothing here is a claim without a receipt.
export const proofPoints: {
  label: string
  text: string
  app: 'experienceDetail' | 'press' | 'leadership'
  param?: string
}[] = [
  {
    label: 'Federal Reserve Board',
    text: 'Scoped, built, and usability-tested a full-stack prototype as a Summer 2026 intern.',
    app: 'experienceDetail',
    param: 'federal-reserve',
  },
  {
    label: 'Published research',
    text: 'Co-author in the Journal of Applied Instructional Design (2026).',
    app: 'press',
  },
  {
    label: 'Lehigh AI Club',
    text: 'President of one of the largest student organizations on campus.',
    app: 'leadership',
  },
]

// Each string is one paragraph in About_Me.txt
export const about: string[] = [
  "What I like most is the full life cycle of building software: the idea, working out how it will come together, building it, and testing it with the people who will use it. That is what I have done in my classes, my projects, and my internship, and it is the work I want to keep doing.",
  "I am just as interested in UX, human-computer interaction, and human-AI interaction: how people experience software and the AI inside it. That is why I study computer science at Lehigh University with minors in data science and graphic design. People call that combination a unicorn, someone who can design it and build it. That is how I think of myself.",
  "This past summer at the Federal Reserve Board I got to do the whole cycle on one product. I scoped and built Knowledge Exchange, a full-stack Flask and PostgreSQL prototype for internal knowledge-sharing, and took it from a design document to a working application to usability testing with real users. The team kept it as the foundation for a future version. Through Lehigh's Global Social Impact Fellowship, I co-built iCodePal, an AI coding tutor Chrome extension for computer science classrooms in India. I own the teacher dashboard, the student code-generation workflows, and the Firebase data layer, and I sat with 30 teachers in southern India while they tried it. Watching someone else use what I built is still my favorite part.",
  "Now I'm a research assistant in Lehigh's DiFranzo Lab, where I'm designing a design fiction study that uses a speculative AI dating-profile experience to explore how people react when AI steps into personal self-presentation. I'm also a grader for CSE 216 Software Engineering and president of Lehigh's AI Club, one of the largest student organizations on campus. That research, along with being named a Lehigh nominee for the Goldwater Scholarship as a sophomore, is pushing me toward a PhD or Master's in HCI, human-centered computing, or information science.",
  'Outside of work, I like to stay active, collect vinyl records, and read murder thrillers.',
]

export const skillGroups = [
  {
    label: 'Engineering',
    items: [
      'Python',
      'Flask',
      'PostgreSQL',
      'TypeScript',
      'React',
      'JavaScript',
      'Firebase / Firestore',
      'Tailwind CSS',
      'REST APIs',
      'Git / GitHub / GitLab',
    ],
  },
  {
    label: 'Design',
    items: [
      'UX/UI Design',
      'Figma',
      'Interaction Design',
      'Visual Identity & Branding',
      'Logo Design',
      'WordPress & SharePoint',
    ],
  },
  {
    label: 'Research & Process',
    items: [
      'Usability Testing',
      'User Interviews',
      'Qualitative Research',
      'Requirements Gathering',
      'Agile / Scrum',
    ],
  },
]
