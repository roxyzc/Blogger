export {};

declare module "express-session" {
  export interface SessionData {
    passport: { [key: string]: any };
  }
}
