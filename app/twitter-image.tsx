// Twitter/X card — same image as OG (1200×630 = summary_large_image)
// runtime/size/contentType must be declared directly; Next.js can't statically analyse re-exports.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export { default } from './opengraph-image'
