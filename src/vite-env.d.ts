/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER: string,
    readonly VITE_SERVER_LOGIN_PATH: string,
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}