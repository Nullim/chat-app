export const SECRET_KEY = process.env.JWT_SECRET_KEY as string
export const REFRESH_KEY = process.env.JWT_REFRESH_KEY as string
export const RECOVERY_KEY = process.env.JWT_RECOVERY_KEY as string
export const RESET_KEY = process.env.JWT_RESET_KEY as string
export const BASE_URL = process.env.FRONTEND_URL as string

export const SUCCESS_MESSAGE = "Success"
export const ERROR_MESSAGE = "Error"
export const VALIDATION_ERROR = "Invalid"

export const EMAIL_HOST = process.env.EMAIL_HOST as string
export const EMAIL_PORT = parseInt(process.env.EMAIL_PORT as string, 10)
export const EMAIL_USER = process.env.EMAIL_USER as string
export const EMAIL_PASS = process.env.EMAIL_PASS as string

export const PORT = parseInt(process.env.port as string, 10) || 3000