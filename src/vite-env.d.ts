/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTO_STYLE_ENDPOINT: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
