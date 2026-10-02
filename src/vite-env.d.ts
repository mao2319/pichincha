/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_ANTHROPIC_API_KEY: string
  readonly VITE_BROWSERBASE_API_KEY?: string
  readonly VITE_BROWSERBASE_PROJECT_ID?: string
  readonly VITE_GITHUB_TOKEN?: string
  readonly VITE_APP_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
