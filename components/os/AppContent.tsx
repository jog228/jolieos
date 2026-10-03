'use client'

import { AboutApp, LeadershipApp, PressApp, SkillsApp, WelcomeApp } from './apps/InfoApps'
import { ContactApp, TerminalApp, TrashApp } from './apps/SystemApps'
import { ExperienceApp, ExperienceDetailApp, PreviewApp, ProjectApp, ProjectsApp, RecordsApp } from './apps/WorkApps'
import type { AppId } from './registry'

export function AppContent({ app, param }: { app: AppId; param?: string }) {
  switch (app) {
    case 'welcome':
      return <WelcomeApp />
    case 'about':
      return <AboutApp />
    case 'experience':
      return <ExperienceApp />
    case 'experienceDetail':
      return <ExperienceDetailApp id={param} />
    case 'projects':
      return <ProjectsApp />
    case 'project':
      return <ProjectApp id={param} />
    case 'preview':
      return <PreviewApp param={param} />
    case 'skills':
      return <SkillsApp />
    case 'leadership':
      return <LeadershipApp />
    case 'press':
      return <PressApp />
    case 'contact':
      return <ContactApp />
    case 'terminal':
      return <TerminalApp />
    case 'trash':
      return <TrashApp />
    case 'records':
      return <RecordsApp />
  }
}
