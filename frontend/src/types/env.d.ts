declare namespace NodeJS {
  interface ProcessEnv {
    ENCRYPTION_KEY: string;
    ENCRYPTION_IV: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    EMAIL_USER: string;
    EMAIL_APP_PASSWORD: string;
    NODE_ENV: "development" | "production";
    NEXT_PUBLIC_FRONTEND_URL: string;
  }
}