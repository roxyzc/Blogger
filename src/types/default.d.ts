export {};

declare global {
  namespace NodeJs {
    interface ProcessEnv {
      PORT: number;
      SALT: number;
      NODE_ENV: string;
      MONGODB_URL: string;
    }
  }
}
