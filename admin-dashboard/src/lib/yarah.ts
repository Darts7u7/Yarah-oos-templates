import { createClient } from '@yarahdev/sdk'
import { env } from './env'

export const yarah = createClient({
  baseUrl: env.VITE_YARAH_URL,
  anonKey: env.VITE_YARAH_ANON_KEY,
})
