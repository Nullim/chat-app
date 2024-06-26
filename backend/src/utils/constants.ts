export const SECRET_KEY = process.env.JWT_SECRET_KEY as string
export const REFRESH_KEY = process.env.JWT_REFRESH_KEY as string

export const PORT = parseInt(process.env.port as string, 10) || 3000