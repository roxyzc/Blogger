export {};

declare global {
  namespace Express {
    export interface Request {
      USER: Record<string | any>;
    }
  }
}
