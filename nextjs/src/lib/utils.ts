export const hasEnvVars = Boolean(
  process.env.NEXT_PUBLIC_YARAH_URL &&
    process.env.NEXT_PUBLIC_YARAH_ANON_KEY &&
    process.env.NEXT_PUBLIC_APP_URL,
);
