export interface PressItem {
  publication: string
  title: string
  date: string
  href: string
  linkLabel?: string
  // Either a pull quote or an author list — not both
  pullQuote?: string
  attribution?: string
  authors?: string
}

export const press: PressItem[] = [
  {
    publication: "The Brown & White",
    title: "Jolie Goldstein turns coding passion into global impact",
    date: "Nov 2025",
    pullQuote:
      "She's very active and always open to learning new knowledge. Not every collaborator on your team would want to donate more time to learn new skills, but she definitely is open to learning new skills.",
    attribution: "Zilong Pan, faculty adviser",
    href: "https://thebrownandwhite.com/2025/11/18/lehigh-student-turns-coding-passion-into-global-impact/",
  },
  {
    publication: "Journal of Applied Instructional Design",
    title:
      "Exploring User-Centered Design and Usability Testing of MathPal: an AI Agent for Math Learning",
    date: "2026",
    authors:
      "Pan, Z., Wu, Y., Wax, A., Rainey, B., Kalam, F., Goldstein, J., Jiang, Z., & Li, C.",
    href: "https://doi.org/10.59668/2579.27203",
    linkLabel: "Read publication",
  },
]
