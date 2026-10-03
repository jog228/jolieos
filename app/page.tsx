import { JolieOS } from '@/components/os/Desktop'

// The whole site is a single interactive desktop: JolieOS.
// Content lives in lib/content.ts, lib/experience.ts, and lib/press.ts.
export default function Home() {
  return <JolieOS />
}
