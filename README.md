# JolieOS

My portfolio, built as a desktop you can click around: [joliegoldstein.com](https://joliegoldstein.com).

Windows drag, resize, minimize, and stack. There is a dock, a menu bar, Spotlight search (`⌘K`), a
working terminal (`help`), light and dark themes, and a turntable that plays my projects as records.
On phones the same apps open full screen.

Built with [Next.js](https://nextjs.org) (App Router), React, and TypeScript, styled with
[Tailwind CSS](https://tailwindcss.com), animated with [Framer Motion](https://www.framer.com/motion/),
and deployed on [Vercel](https://vercel.com).

## Things worth a look

- **A small window manager.** `components/os/OSProvider.tsx` holds every open window in one reducer:
  open, focus, minimize, zoom, move, resize, and z-order.
- **Deep links.** Each window has a URL, such as `/#project/intelswap`, and the hash follows the
  focused window so any view can be shared.
- **Content is data.** All copy lives in `lib/`. The apps, Spotlight, and the terminal read from the
  same files, so adding a project in one place updates all of them.
- **Accessibility.** Keyboard navigation for menus, tabs, and Spotlight; labelled dialogs; visible
  focus states; and reduced-motion support.
- **No image requests for icons.** Every icon is inline SVG (`components/os/AppIcon.tsx`).

## Project structure

- `app/`: root layout, metadata, global styles, and the generated Open Graph image
- `components/os/`: the desktop. `Desktop.tsx` (desktop, dock), `MenuBar.tsx` (menus, Spotlight),
  `Window.tsx`, `OSProvider.tsx` (window manager), `registry.ts` (every app and its default size)
- `components/os/apps/`: what renders inside each window
- `lib/`: site content. `content.ts` (profile, about, skills), `experience.ts` (roles, projects,
  leadership), `press.ts`
- `providers/`: theme (light and dark)

## Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables are needed.
