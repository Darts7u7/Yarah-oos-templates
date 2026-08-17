/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YARAH_URL: string;
  readonly VITE_YARAH_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
