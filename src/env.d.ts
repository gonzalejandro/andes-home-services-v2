/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly JOBBER_CLIENT_ID: string;
  readonly JOBBER_CLIENT_SECRET: string;
  readonly JOBBER_REFRESH_TOKEN: string;
  readonly JOBBER_GRAPHQL_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
