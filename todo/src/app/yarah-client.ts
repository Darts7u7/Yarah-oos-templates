import { createClient } from "@yarahdev/sdk";

export const yarah = createClient({
  baseUrl: process.env.NEXT_PUBLIC_YARAH_URL!,
  anonKey: process.env.NEXT_PUBLIC_YARAH_ANON_KEY!,
});
