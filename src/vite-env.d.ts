/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
declare const APP_VERSION: string;
declare const APP_BUILD_DATE: string;
declare const APP_MODE: string;

interface ImportMetaEnv {
  readonly VITE_API: string;
  readonly HCAPTCHA_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
