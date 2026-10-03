// App registry: every window type JolieOS can open, with its default
// title, icon, and size. Rendering lives in AppContent.tsx so this file
// stays free of component imports (avoids circular deps with OSProvider).

import { experience } from '@/lib/experience'
import type { IconName } from './AppIcon'

export type AppId =
  | 'welcome'
  | 'about'
  | 'experience'
  | 'experienceDetail'
  | 'projects'
  | 'project'
  | 'preview'
  | 'skills'
  | 'leadership'
  | 'press'
  | 'contact'
  | 'terminal'
  | 'trash'
  | 'records'

export interface AppMeta {
  title: string
  icon: IconName
  w: number
  h: number
}

export const allProjects = experience.flatMap(exp =>
  exp.projects.map(p => ({ ...p, experienceId: exp.id, organization: exp.organization })),
)

export function findProject(id?: string) {
  return allProjects.find(p => p.id === id)
}

export function findExperience(id?: string) {
  return experience.find(e => e.id === id)
}

export function getMeta(app: AppId, param?: string): AppMeta {
  switch (app) {
    case 'welcome':
      return { title: 'Welcome', icon: 'readme', w: 560, h: 540 }
    case 'about':
      return { title: 'About Me.txt', icon: 'doc', w: 640, h: 580 }
    case 'experience':
      return { title: 'Experience', icon: 'calendar', w: 900, h: 560 }
    case 'experienceDetail': {
      const exp = findExperience(param)
      return { title: exp ? shortOrg(exp.organization) : 'Experience', icon: 'folder', w: 640, h: 540 }
    }
    case 'projects':
      return { title: 'Projects', icon: 'folder', w: 720, h: 500 }
    case 'project': {
      const p = findProject(param)
      return { title: p?.title ?? 'Project', icon: 'app', w: 760, h: 620 }
    }
    case 'preview': {
      const p = findProject((param ?? '').split(':')[0])
      return { title: `Preview: ${p?.title ?? 'Image'}`, icon: 'image', w: 860, h: 600 }
    }
    case 'skills':
      return { title: 'Skills', icon: 'gear', w: 520, h: 440 }
    case 'leadership':
      return { title: 'Leadership', icon: 'trophy', w: 540, h: 430 }
    case 'press':
      return { title: 'Press', icon: 'press', w: 620, h: 540 }
    case 'contact':
      return { title: 'New Message', icon: 'mail', w: 560, h: 500 }
    case 'terminal':
      return { title: 'Terminal: guest@jolieos', icon: 'terminal', w: 640, h: 420 }
    case 'trash':
      return { title: 'Trash', icon: 'trash', w: 500, h: 340 }
    case 'records':
      return { title: 'Records', icon: 'vinyl', w: 640, h: 420 }
  }
}

// Gradient colors for each project's app icon
export const PROJECT_HUES: Record<string, [string, string]> = {
  intelswap: ['#8b7bff', '#4b2fd6'],
  mathpal: ['#ffb36b', '#f2622d'],
  icodepal: ['#5fe0b4', '#109a73'],
  '81-north': ['#7cc4ff', '#1f5fbf'],
  'your-fine-trip': ['#ffd27a', '#d39614'],
}

// "Federal Reserve Board · Division of R&S" → "Federal Reserve Board"
export function shortOrg(org: string) {
  return org.split(/[·,(]/)[0].trim()
}

export function windowId(app: AppId, param?: string) {
  return param ? `${app}/${param}` : app
}

const APP_IDS: AppId[] = [
  'welcome', 'about', 'experience', 'experienceDetail', 'projects', 'project',
  'preview', 'skills', 'leadership', 'press', 'contact', 'terminal', 'trash', 'records',
]

// Parses a location hash like "#project/intelswap" for deep links
export function parseHash(hash: string): { app: AppId; param?: string } | null {
  const raw = decodeURIComponent(hash.replace(/^#/, ''))
  if (!raw) return null
  const [app, ...rest] = raw.split('/')
  if (!APP_IDS.includes(app as AppId)) return null
  const param = rest.join('/') || undefined
  if (app === 'project' && !findProject(param)) return null
  if (app === 'experienceDetail' && !findExperience(param)) return null
  return { app: app as AppId, param }
}
