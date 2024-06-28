export const SECRET_KEY = process.env.JWT_SECRET_KEY as string
export const REFRESH_KEY = process.env.JWT_REFRESH_KEY as string
export const BASE_URL = process.env.FRONTEND_URL as string

export const SUCCESS_MESSAGE = "Success"
export const ERROR_MESSAGE = "Error"
export const VALIDATION_ERROR = "Invalid"

export const PORT = parseInt(process.env.port as string, 10) || 3000