import { PassportProfile } from "./passport";

declare global {
  namespace Express {
    interface Request {
      token?: string
      profile?: PassportProfile
    }
  }
}