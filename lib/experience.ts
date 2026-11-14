// Project — a specific deliverable, always produced under a parent Experience.
export interface Project {
  id: string
  title: string
  year: number
  order: number // chronological sort key across all projects — higher is more recent
  tags: string[]
  summary: string
  /** What I personally did, in one line. Shown in the "At a glance" panel. */
  myRole?: string
  /** Where the project ended up, in one line. Keep it honest and current. */
  outcome?: string
  problem: string
  /** Separate paragraphs with a blank line (\n\n). */
  process: string
  links?: {
    label: string
    href: string
  }[]
  /** Overrides the default first-letter badge shown on the project's icon/preview */
  badge?: string
  /** The first image doubles as the cover in the Projects grid. */
  images?: {
    src: string
    alt: string
    /** 'contain' for logos that shouldn't be cropped (default is 'cover') */
    fit?: 'cover' | 'contain'
    /** Background behind a contained image */
    bg?: string
  }[]
  /** Small caption under the Screens section */
  imagesNote?: string
}

// Experience — a defined engagement (internship, program, freelance practice).
// Its `projects` are the concrete things built during that engagement.
export interface Experience {
  id: string
  role: string
  organization: string
  location: string
  dates: string
  /** 3-4 skimmable bullets. Shown above the description. */
  highlights?: string[]
  description: string
  projects: Project[]
}

export interface LeadershipItem {
  role: string
  organization: string
  dates: string
  note?: string
}

export const experience: Experience[] = [
  {
    id: "federal-reserve",
    role: "Application Design & Development Intern",
    organization: "Federal Reserve Board · Division of Research & Statistics",
    location: "Washington, DC",
    dates: "Jun 2026 – Aug 2026",
    highlights: [
      "Wrote the design document and prioritized the feature set for a replacement to the division's Drupal knowledge-sharing tool",
      "Built a working full-stack prototype in Flask and PostgreSQL: posts, tagged questions, comments with code blocks and file attachments, archiving, and profiles",
      "Led usability testing with employees and demoed the prototype to 12+ staff",
      "Contributed to the division's SharePoint Online migration on an Agile team of UX designers, engineers, and product managers",
    ],
    description: "Scoped, designed, and built Knowledge Exchange, a working full-stack Flask/PostgreSQL prototype designed to replace an aging Drupal tool for internal knowledge-sharing across the Board. I wrote the design document, prioritized the feature set, built the application solo, and led usability testing with real users in the final weeks. The team kept the prototype as the foundation for a future version. Alongside that, I contributed to the division's SharePoint Online migration and day-to-day requests for the R&S division site, working on a cross-functional team of UX designers, engineers, and product managers in an Agile workflow.",
    projects: [
      {
        id: "intelswap",
        title: "Intelswap",
        year: 2026,
        order: 5,
        badge: "i",
        tags: ["Full-Stack", "Flask", "PostgreSQL", "UX Research"],
        summary:
          "A full-stack knowledge-sharing platform I prototyped during my Federal Reserve Board internship, then rebuilt as a standalone portfolio project.",
        myRole: "Sole developer and designer. Wrote the design document, built the application, and ran usability testing.",
        outcome: "Working prototype. The Fed team kept it as the foundation for a future version; it is not in production.",
        problem:
          "The Federal Reserve Board's internal knowledge-sharing tool ran on Drupal, which the division was retiring, and there was no clear plan for what would replace it. Employees needed a place to post questions, share working code, and find answers other people had already worked out, without losing that history when Drupal came down.",
        process:
          "I scoped the rebuild myself: wrote the design document, prioritized which features actually mattered, and built the full application in Flask and PostgreSQL from the ground up, including posts, tagged questions, comments that support inline code and file attachments, favoriting, archiving, and a personal profile with post history.\n\nI ran usability testing with real employees in the final weeks, walking them through tasks like posting a question, finding it again later, and referring a colleague to it, then used that feedback to adjust the interface. The result was a working prototype, not a production launch: the team kept it as the foundation for a future version.\n\nAfter the internship, I rebuilt the project from scratch as a standalone portfolio piece: replaced the Fed's internal SSO with a session-based demo login, removed every Fed-specific reference from the templates and rewrote the database layer, and moved configuration into environment variables so anyone can run it locally.",
        links: [
          {
            label: "View on GitHub",
            href: "https://github.com/jog228/intelswap",
          },
        ],
        images: [
          { src: "/intelswap/home.png", alt: "Home feed with search, filters, and recent posts" },
          { src: "/intelswap/view-post.png", alt: "A question with tags, edit history, and bookmarking" },
          { src: "/intelswap/answer-accepted.png", alt: "Comment editor with code blocks, attachments, and an accepted answer" },
          { src: "/intelswap/browse-by-tag.png", alt: "Browse by tag, with an A to Z index" },
          { src: "/intelswap/view-bookmarks.png", alt: "Profile dashboard showing bookmarks" },
        ],
        imagesNote: "Screens are from the standalone Intelswap rebuild, running on demo data.",
      },
    ],
  },

  {
    id: "difranzo-lab",
    role: "Undergraduate Research Assistant",
    organization: "DiFranzo Lab (Human-Computer Interaction), Lehigh University",
    location: "Bethlehem, PA",
    dates: "Jan 2026 – Present",
    highlights: [
      "Designing a design fiction study built around a speculative AI-assisted dating profile experience",
      "Completed a literature review on trust in human-AI interaction (Spring 2026)",
      "Currently in the concept and study-design phase",
    ],
    description: "After spending Spring 2026 on a literature review of trust in human-AI interaction, I'm now using design fiction to explore how people respond when AI enters personal self-presentation. I'm designing a speculative AI-assisted dating profile experience: a realistic but fictional product that lets participants react to an AI-mediated future before it fully exists. Currently in the concept and study-design phase, the project treats the prototype as a research probe, surfacing people's expectations and concerns about authenticity, trust, and control rather than testing a finished tool.",
    projects: [],
  },

  {
    id: "creative-inquiry",
    role: "Global Social Impact / Continuing Impact Fellow",
    organization: "Creative Inquiry Program, Lehigh University",
    location: "Bethlehem, PA",
    dates: "Jan 2025 – Present",
    highlights: [
      "MathPal: ran in-school usability interviews during a month-long classroom test with three 9th-grade teachers and 78 Algebra I students",
      "Co-authored the published findings in the Journal of Applied Instructional Design (2026)",
      "iCodePal: built the teacher dashboard, the student help workflows, and the Firebase authentication and data layer",
      "Demonstrated iCodePal hands-on to 30 teachers in southern India",
    ],
    description: "Research and development through Lehigh's Creative Inquiry program on two AI-powered learning tools: usability testing and in-school interviews with students and teachers for MathPal, and co-building iCodePal, a Chrome extension for computer science classrooms in India.",
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
        myRole: "UX researcher. Ran in-school usability interviews with students and teachers; co-author on the paper.",
        outcome: "Findings published in the Journal of Applied Instructional Design (2026).",
        problem:
          "Generative-AI tools were arriving in classrooms faster than anyone could tell whether they actually worked for the students using them. MathPal needed to support real math learners (not just demo well) which meant proving its usability and trustworthiness with teachers and students before any classroom rollout.",
        process:
          "I joined MathPal for its second round of usability testing, when the tool went into real classrooms including three 9th-grade teachers and 78 Algebra I students using it for a month.\n\nI conducted in-school usability interviews, sitting with students and teachers after they'd actually used MathPal to find out what was landing and what wasn't. That's where the most useful feedback came from: students wanted a stuck detection feature that would notice when they were struggling, while teachers wanted more control over managing access during assessments, uploading their own worksheets, seeing analytics on how students were interacting with the tool.\n\nI co-authored the published findings, \"Exploring User-Centered Design and Usability Testing of MathPal\", in the Journal of Applied Instructional Design.",
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
        myRole: "Co-lead. I built the teacher dashboard, student help workflows, and Firebase auth and data layer; my partner built the Scratch integration and API layer.",
        outcome: "Demonstrated hands-on to 30 teachers in southern India.",
        problem:
          "In many under-resourced classrooms, computer science is taught by teachers without formal programming training, in large classes with limited time and shared devices. Students learning to code in Scratch get little conceptual feedback, so they fall back on snapping blocks together at random instead of reasoning through the logic. iCodePal set out to put that missing feedback directly into the editor, without replacing the teacher or requiring infrastructure these schools don't have.",
        process:
          "iCodePal is a Chrome extension that works directly inside Scratch, the block-based editor students use in their first year of coding. I co-led its design and development with a partner: my partner built the Scratch integration and API layer, and I built the teacher dashboard, the student-facing help workflows, and the Firebase authentication and data layer behind them.\n\nTogether we chose an on-request feedback model: iCodePal only reads a student's code when they click to ask for help, then returns guidance inside the editor without giving away the answer. We made that choice deliberately, to keep students in control and avoid burying them in unsolicited feedback.\n\nOn my side, the hardest constraint was accounts. These classrooms share devices and many students don't have email addresses, so I built authentication around teacher-generated class and student codes instead of individual logins. Each interaction is logged to Firestore under an anonymized ID, which let me build a dashboard where teachers create and manage classes and see how students are engaging, with no one needing a personal account.\n\nThese decisions were shaped by fieldwork with the Agastya International Foundation in southern India, where I demonstrated iCodePal to 30 teachers, had them use it hands-on, and talked with them about what actually constrains them: large classes, limited time, shared devices, and English-centric interfaces.",
        links: [
          {
            label: "Visit iCodePal",
            href: "https://wordpress.lehigh.edu/icodepal/",
          },
        ],
        images: [
          { src: "/icode.png", alt: "The iCodePal information site, showing the extension running inside Scratch" },
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
        myRole: "Designer. Brand, logo, and the full site build on a no-code platform.",
        outcome: "Live at 81north.ai and maintained by the team.",
        problem:
          "81 North needed a credible, professional web presence to introduce an AI-driven recruitment service to two very different audiences at once: job seekers looking for roles and companies looking to hire. The small team also needed a site they could keep current on their own, without a developer on call for every change.",
        process:
          "I designed the brand, including the logo, and built out the full site: home, services, separate job-seeker and hiring pages, interview coaching, and a blog.\n\nI structured the pages around the two audiences the business serves, keeping the message clear and distinct for each. I built it on a no-code platform on purpose, so the team could update content and publish new posts themselves rather than depending on a developer for every change. The result is a live business site the company maintains on its own.",
        links: [
          {
            label: "Visit 81 North",
            href: "https://81north.ai/",
          },
        ],
        images: [
          { src: "/81north.png", alt: "The 81 North logo I designed: a compass rose over the wordmark", fit: "contain", bg: "#ffffff" },
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
        myRole: "Designer and developer. Brand, logo, and the WordPress build.",
        outcome: "Live at yourfinetrip.com and run by the client.",
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
        images: [
          { src: "/finetrip.png", alt: "Your Fine Trip home page, with the logo and a mountain hero image" },
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
    id: "atmoshear",
    title: "AtmosHear",
    course: "DES 156 · Lehigh University",
    year: 2026,
    order: 7,
    badge: "a",
    tags: ["React Native", "TypeScript", "Expo", "Claude Code", "Sound & Haptics", "UX Research"],
    summary:
      "A weather app you can hear and feel. Each condition has its own sound, vibration pattern, and visual style, and the alarm wakes you to the weather outside. Built by a team of three, with me as technical lead, and now funded by a Lehigh CAS Undergraduate Research Grant.",
    myRole: "Technical lead on a team of three. I built the mobile app in React Native and TypeScript with Expo, using Claude Code: live weather data, the logic that maps each condition to its sound and vibration, haptic feedback, and the alarm.",
    outcome: "Working prototype. Awarded a Lehigh CAS Undergraduate Research Grant ($654) in November 2026 to take it from class project to a tested, installable app.",
    problem:
      "Weather apps speak almost entirely to the eyes: numbers, icons, maps, written forecasts. Our question was how weather could be communicated through sound and touch as well, so people can understand the conditions outside without relying on vision alone, and without forcing every user onto every sensory channel.",
    process:
      "AtmosHear started as a team project in DES 156 (User Experience Design) with Hannah Roznitsky and Sofia Feinstein. We began with a mobile weather interface and widened it into a bedside experience: the app, a layer of sound and vibration, and a companion alarm clock, so the forecast becomes part of how you wake up instead of something you open and check.\n\nMy part was the engineering. I built the app in React Native and TypeScript with Expo, using Claude Code as my development tool. It pulls live forecasts from Open-Meteo and maps each condition to a matching sound, vibration pattern, and visual style. Sound and vibration can each be switched off, and there are light, dark, and high-contrast themes, so nobody has to rely on every channel. I also built the alarm, which wakes you to the sound of the weather outside instead of a standard tone. A bedside mode turns the phone into a clock that rests on the companion alarm clock.\n\nSofia designed the visual identity and the interface: the style tile, the weather icon set, the logo, and the app screens. She also designed the physical alarm clock and built it as a laser-cut chipboard model. Hannah sourced and edited the weather sounds and wrote the project's case study. Professor Jenny Kowalski is our faculty advisor.\n\nThe prototype has limits worth stating plainly. It runs in Expo Go, which cannot play sounds and haptics while a phone is locked or silenced, so the alarm has not been tested the way people would actually use it. The clock is a form study, not a working device. And we have not run user testing yet, so we do not know whether the cues are as recognizable as we intend.\n\nThat is what the grant is for. In November 2026 our proposal was awarded a Lehigh College of Arts and Sciences Undergraduate Research Grant. The plan is a literature review and IRB approval first, then two rounds of usability testing in spring 2027: a lab round on whether people can recognize weather from sound and vibration, and a week-long round with the app on participants' own phones. I will get the app onto TestFlight, add the instrumentation the study needs, and co-lead the sessions and analysis with my teammates. Hannah leads the quantitative analysis, and Sofia refines the visual cues.",
    links: [
      {
        label: "Read the case study",
        href: "https://medium.com/@hannahroznitsky/atmoshear-a-multisensory-weather-experience-945376441e94",
      },
      {
        label: "View on GitHub",
        href: "https://github.com/jog228/AtmosHear",
      },
    ],
  },
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
    myRole: "Solo designer. Personas, visual identity, and the interactive Figma prototype.",
    outcome: "Figma prototype with a written case study on Medium.",
    problem:
      "Online vinyl stores are built for finding a title you already know: grids, filters, a search bar. But collectors don't shop that way. Independent record stores are still the top place people buy vinyl, and the reason is discovery: flipping through a bin and pulling out something you didn't know you wanted. My question was: how might we make browsing a record shop on your phone feel like digging through a crate, and not searching a database?",
    process:
      "I started from two personas: Marcus, a longtime collector who doesn't trust buying online without seeing pressing details, and Nia, a newer collector who buys on her phone for the cover art and the thrill of finding something. Both pointed to the same insight: discovery is the motivation, and artwork drives the purchase. So I dropped the search bar and let people browse the way a real shop is organized, by genre or A to Z, with the language to match (\"Dig By\" instead of \"Shop By,\" \"My Crate\" instead of cart).\n\nThe visual direction came from five words: analog, discoverable, nostalgic, tactile, and soulful, carried through Audiowide headers, DM Mono body text, warm colors, and stippled illustrations. The centerpiece is an interactive stack where records sit as sleeves and the selected one pulls forward to show its cover; I prototyped it in Figma Make before bringing it into the main design file.\n\nProduct pages lead with pressing and label info, the details collectors actually check. Checkout, on the other hand, stays deliberately conventional (Billing, Payment, Confirmation) so the experimentation lives in browsing and never gets in the way of buying, ending on a ticket-stub receipt that keeps the record-shop feel.\n\nNext steps: usability testing with other collectors, checking whether the stack holds up with hundreds of records, and a full accessibility review, since a visual, swipe-based stack needs a clear screen-reader and keyboard alternative.",
    links: [
      {
        label: "Read the case study",
        href: "https://medium.com/@jog228/cut-out-bin-designing-a-record-shop-for-digging-not-searching-939b8c6e7a9f",
      },
    ],
    images: [
      { src: "/cutout.png", alt: "The Cut-Out Bin logo", fit: "contain", bg: "#d1a653" },
    ],
  },
]

export const leadership: LeadershipItem[] = [
  {
    role: "President",
    organization: "Lehigh AI Club",
    dates: "May 2026 – Present",
    note: "One of the largest student organizations on campus. Launched the AI Builder Society within the club.",
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
    dates: "Aug 2025 – Apr 2026",
  },

]
