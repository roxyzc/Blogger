export {};

declare global {
  namespace NodeJs {
    interface ProcessEnv {
      PORT: number;
      SALT: number;
      NODE_ENV: string;
      MONGODB_URL: string;
      ACCESSTOKENSECRET: string;
      REFRESHTOKENSECRET: string;
      USER: string;
      PASS: string;
      USERNAME_ADMIN: string;
      PASSWORD_ADMIN: string;
      EMAIL_ADMIN: string;
    }
  }
}
