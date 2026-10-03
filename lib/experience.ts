// Project — a specific deliverable, always produced under a parent Experience.
export interface Project {
  id: string
  title: string
  year: number
  order: number // chronological sort key across all projects — higher is more recent
  tags: string[]
  summary: string
  problem: string
  process: string
  links?: {
    label: string
    href: string
  }[]
  /** Overrides the default first-letter badge shown on the project's icon/preview */
  badge?: string
  images?: {
    src: string
    alt: string
  }[]
}

// Experience — a defined engagement (internship, program, freelance practice).
// Its `projects` are the concrete things built during that engagement.
export interface Experience {
  id: string
  role: string
  organization: string
  location: string
  dates: string
  description: string
  projects: Project[]
}

export interface LeadershipItem {
  role: string
  organization: string
  dates: string
}

export const experience: Experience[] = [
  {
    id: "federal-reserve",
    role: "Application Design & Development Intern",
    organization: "Federal Reserve Board · Division of Research & Statistics",
    location: "Washington, DC",
    dates: "Jun 2026 – Aug 2026",
    description: "Scoped, designed, and built Knowledge Exchange, a full-stack Flask/PostgreSQL platform replacing an aging Drupal tool for internal knowledge-sharing across the Board. I wrote the design document, prioritized the feature set, built the application solo, and led usability testing with real users in the final weeks. Alongside that, I contributed to the division's SharePoint Online migration and day-to-day requests for the R&S division site, working on a cross-functional team of UX designers, engineers, and product managers in an Agile workflow.",
    projects: [
      {
        id: "intelswap",
        title: "Intelswap",
        year: 2026,
        order: 5,
        badge: "i",
        tags: ["Full-Stack", "Flask", "PostgreSQL", "UX Research"],
        summary:
          "A full-stack internal knowledge-sharing platform built during a Federal Reserve Board internship, later rebuilt as a standalone portfolio project.",
        problem:
          "The Federal Reserve Board's internal knowledge-sharing tool ran on Drupal, which the division was retiring, and there was no clear plan for what would replace it. Employees needed a place to post questions, share working code, and find answers other people had already worked out, without losing that history when Drupal came down.",
        process:
          "I scoped the rebuild myself: wrote the design document, prioritized which features actually mattered, and built the full application in Flask and PostgreSQL from the ground up, including posts, tagged questions, comments that support inline code and file attachments, favoriting, archiving, and a personal profile with post history. I ran usability testing with real employees in the final weeks, walking them through tasks like posting a question, finding it again later, and referring a colleague to it, then used that feedback to adjust the interface. After the internship, I rebuilt the project from scratch as a standalone portfolio piece: replaced the Fed's internal SSO with a session-based demo login, removed every Fed-specific reference from the templates and rewrote the database layer, and moved configuration into environment variables so anyone can run it locally.",
        links: [
          {
            label: "View on GitHub",
            href: "https://github.com/jog228/intelswap",
          },
        ],
      },
    ],
  },

  {
    id: "difranzo-lab",
    role: "Undergraduate Research Assistant",
    organization: "DiFranzo Lab (Human-Computer Interaction), Lehigh University",
    location: "Bethlehem, PA",
    dates: "Jan 2026 – Present",
    description: "After spending Spring 2026 on a literature review of trust in human-AI interaction, I'm now using design fiction to explore how people respond when AI enters personal self-presentation. I'm designing a speculative AI-assisted dating profile experience: a realistic but fictional product that lets participants react to an AI-mediated future before it fully exists. Currently in the concept and study-design phase, the project treats the prototype as a research probe, surfacing people's expectations and concerns about authenticity, trust, and control rather than testing a finished tool.",
    projects: [],
  },

  {
    id: "creative-inquiry",
    role: "Global Social Impact / Continuing Impact Fellow",
    organization: "Creative Inquiry Program, Lehigh University",
    location: "Bethlehem, PA",
    dates: "JAN 2025 - PRESENT",
    description: "Ongoing UX research through Lehigh's Creative Inquiry program: usability testing and design work on two AI-powered learning tools, MathPal and iCodePal, including in-classroom interviews with real students and teachers.",
    projects: [
      {
        id: "mathpal",
        title: "MathPal",
        year: 2025,
        order: 3,
        badge: "m",
        tags: ["UX Research", "Usability Testing", "Generative AI", "Branding"],
        summary:
          "A generative-AI tutor that gives high school students conceptual and metacognitive math support, refined over two rounds of classroom usability testing with teachers and students.",
        problem:
          "Generative-AI tools were arriving in classrooms faster than anyone could tell whether they actually worked for the students using them. MathPal needed to support real math learners (not just demo well) which meant proving its usability and trustworthiness with teachers and students before any classroom rollout.",
        process:
          "I joined MathPal for its second round of usability testing, when the tool went into real classrooms including three 9th-grade teachers and 78 Algebra I students using it for a month. I conducted in-school usability interviews, sitting with students and teachers after they'd actually used MathPal to find out what was landing and what wasn't. That's where the most useful feedback came from: students wanted a stuck detection feature that would notice when they were struggling, while teachers wanted more control over managing access during assessments, uploading their own worksheets, seeing analytics on how students were interacting with the tool. I co-authored the published findings, \"Exploring User-Centered Design and Usability Testing of MathPal\", in the Journal of Applied Instructional Design.",
        links: [
          {
            label: "Read publication",
            href: "https://jaid.edtechbooks.org/jaid_15_2/swrcpddcag",
          },
          {
            label: "Visit MathPal",
            href: "https://stempal.us/",
          },
        ],
      },
      {
        id: "icodepal",
        title: "iCodePal",
        year: 2026,
        order: 4,
        badge: "ic",
        tags: ['Firebase', 'Chrome Extension', 'JavaScript', 'UX Research', 'AI in Education'],
        summary:
          "An AI-powered coding companion that gives K-12 learners conceptual and metacognitive support as they learn to program, built for computer science classrooms with the Agastya International Foundation in India. I built the teacher dashboard and Firebase data layer.",
        problem:
          "In many under-resourced classrooms, computer science is taught by teachers without formal programming training, in large classes with limited time and shared devices. Students learning to code in Scratch get little conceptual feedback, so they fall back on snapping blocks together at random instead of reasoning through the logic. iCodePal set out to put that missing feedback directly into the editor, without replacing the teacher or requiring infrastructure these schools don't have.",
        process:
          "iCodePal is a Chrome extension that works directly inside Scratch, the block-based editor students use in their first year of coding. I co-led its design and development with a partner: my partner built the Scratch integration and API layer, and I built the teacher dashboard, the student-facing help workflows, and the Firebase authentication and data layer behind them. Together we chose an on-request feedback model: iCodePal only reads a student's code when they click to ask for help, then returns guidance inside the editor without giving away the answer. We made that choice deliberately, to keep students in control and avoid burying them in unsolicited feedback. On my side, the hardest constraint was accounts. These classrooms share devices and many students don't have email addresses, so I built authentication around teacher-generated class and student codes instead of individual logins. Each interaction is logged to Firestore under an anonymized ID, which let me build a dashboard where teachers create and manage classes and see how students are engaging, with no one needing a personal account. These decisions came out of fieldwork with the Agastya International Foundation in southern India, where I observed classrooms and talked with teachers about what actually constrains them: large classes, limited time, shared devices, and English-centric interfaces.",
        links: [
          {
            label: "Visit iCodePal",
            href: "https://wordpress.lehigh.edu/icodepal/",
          },
        ],
      },
    ],
  },

  {
    id: "freelance",
    role: "Freelance Web Designer",
    organization: "Independent",
    location: "Remote",
    dates: "2024 – 2025",
    description: "Independent freelance web design work for two small businesses: brand identity and full site builds for 81 North, an AI-driven recruitment startup, and Your Fine Trip, a luxury travel advisor.",
    projects: [
      {
        id: "81-north",
        title: "81 North",
        year: 2024,
        order: 1,
        badge: "81",
        tags: ["Web Design", "Branding", "Content Strategy"],
        summary:
          "Brand identity and a multi-page marketing site for an AI-driven recruitment startup, designed and maintained end to end.",
        problem:
          "81 North needed a credible, professional web presence to introduce an AI-driven recruitment service to two very different audiences at once: job seekers looking for roles and companies looking to hire. The small team also needed a site they could keep current on their own, without a developer on call for every change.",
        process:
          "I designed the brand, including the logo, and built out the full site: home, services, separate job-seeker and hiring pages, interview coaching, and a blog. I structured the pages around the two audiences the business serves, keeping the message clear and distinct for each. I built it on a no-code platform on purpose, so the team could update content and publish new posts themselves rather than depending on a developer for every change. The result is a live business site the company maintains on its own.",
        links: [
          {
            label: "Visit 81 North",
            href: "https://81north.ai/",
          },
        ],
      },
      {
        id: "your-fine-trip",
        title: "Your Fine Trip",
        year: 2025,
        order: 2,
        badge: "y",
        tags: ["Web Design", "Branding", "Visual Identity"],
        summary:
          "Brand identity and website for an independent luxury travel advisor, built freelance from logo to launch.",
        problem:
          "An independent travel advisor needed a professional online presence to establish her brand and give prospective clients an easy way to learn about her and get in touch. As a solo business, she needed something polished but simple, a site that made a strong first impression without becoming a maintenance burden.",
        process:
          "I designed the brand and logo and built the site on WordPress: a clean, three-page presence (home, about, and contact) focused on making a personal, design-forward first impression for prospective travelers. I leaned on my graphic design background to set the visual identity, choosing the type, color, and imagery to feel warm and high-end rather than generic. I built it to be straightforward to maintain, then handed the finished site off to the client to run on her own.",
        links: [
          {
            label: "Visit Your Fine Trip",
            href: "https://yourfinetrip.com/",
          },
        ],
      },
    ],
  },
]

// Coursework — class projects. These show up in Projects, Records, search,
// and the terminal, but not in the Experience calendar (a class isn't a job).
export interface CourseworkProject extends Project {
  course: string // e.g. "DES 156 · Lehigh University"
}

export const coursework: CourseworkProject[] = [
  {
    id: "cut-out-bin",
    title: "Cut-Out Bin",
    course: "DES 156 · Lehigh University",
    year: 2026,
    order: 6,
    badge: "c",
    tags: ["UX/UI Design", "Interaction Design", "Figma", "E-Commerce"],
    summary:
      "A mobile record shop for vinyl collectors that swaps the product grid for a browsable stack of sleeves, so shopping online feels like digging through a crate instead of searching a database.",
    problem:
      "Online vinyl stores are built for finding a title you already know: grids, filters, a search bar. But collectors don't shop that way. Independent record stores are still the top place people buy vinyl, and the reason is discovery: flipping through a bin and pulling out something you didn't know you wanted. My question was: how might we make browsing a record shop on your phone feel like digging through a crate, and not searching a database?",
    process:
      "I started from two personas: Marcus, a longtime collector who doesn't trust buying online without seeing pressing details, and Nia, a newer collector who buys on her phone for the cover art and the thrill of finding something. Both pointed to the same insight: discovery is the motivation, and artwork drives the purchase. So I dropped the search bar and let people browse the way a real shop is organized, by genre or A to Z, with the language to match (\"Dig By\" instead of \"Shop By,\" \"My Crate\" instead of cart). The visual direction came from five words: analog, discoverable, nostalgic, tactile, and soulful, carried through Audiowide headers, DM Mono body text, warm colors, and stippled illustrations. The centerpiece is an interactive stack where records sit as sleeves and the selected one pulls forward to show its cover; I prototyped it in Figma Make before bringing it into the main design file. Product pages lead with pressing and label info, the details collectors actually check. Checkout, on the other hand, stays deliberately conventional (Billing, Payment, Confirmation) so the experimentation lives in browsing and never gets in the way of buying, ending on a ticket-stub receipt that keeps the record-shop feel. Next steps: usability testing with other collectors, checking whether the stack holds up with hundreds of records, and a full accessibility review, since a visual, swipe-based stack needs a clear screen-reader and keyboard alternative.",
    links: [
      {
        label: "Read the case study",
        href: "https://medium.com/@jog228/cut-out-bin-designing-a-record-shop-for-digging-not-searching-939b8c6e7a9f",
      },
    ],
  },
]

export const leadership: LeadershipItem[] = [
  {
    role: "President",
    organization: "AI Club",
    dates: "May 2026 – Present",
  },

  {
    role: "ChatCSE Ambassador",
    organization: "Lehigh CSE Department",
    dates: "Oct 2025 – Present",
  },

  {
    role: "Grader, CSE 216 Software Engineering",
    organization: "Lehigh CSE Department",
    dates: "Aug 2026 – Present",
  },


  {
    role: "Student Engagement Officer",
    organization: "Lehigh Women in Computer Science (WiCS)",
    dates: "Aug 2025 – Aug 2026",
  },

  {
    role: "Treasurer",
    organization: "Lehigh AI Club",
    dates: "Aug 2025 – April 2026",
  },

]
