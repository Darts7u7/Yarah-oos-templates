import { z } from 'zod'

const schema = z.object({
  VITE_YARAH_URL: z.string().url(),
  VITE_YARAH_ANON_KEY: z.string().min(1),
})

const parsed = schema.safeParse(import.meta.env)

if (!parsed.success) {
  // Surface a clear message in the browser console so missing config is obvious.
  console.error(
    'Missing Yarah env vars. Copy .env.example to .env and fill VITE_YARAH_URL + VITE_YARAH_ANON_KEY.',
    parsed.error.flatten().fieldErrors,
  )
  throw new Error('Missing Yarah env vars')
}

export const env = parsed.data
