import nodemailer from "nodemailer"
import { 
  EMAIL_HOST, 
  EMAIL_PASS, 
  EMAIL_PORT, 
  EMAIL_USER 
} from "./constants"

export const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
})
