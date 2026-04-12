/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTO_STYLE_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
