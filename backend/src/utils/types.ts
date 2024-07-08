import { Request } from "express"

export interface ValidationRequest extends Request {
  user?: {
    id: string,
    username: string,
  }
}
