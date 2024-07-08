import jwt from "jsonwebtoken"
import { Response, NextFunction } from "express"

import { SECRET_KEY, REFRESH_KEY } from "../utils/constants"
import { ValidationRequest } from "../utils/types"

export const verifyToken = (req: ValidationRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['accessToken'] as string
  const refreshToken = req.cookies['refreshToken'] as string

  if (!accessToken && !refreshToken) return res.status(401).json({ message: "Access denied: no token provided" })
  
  try {
    const { user } = jwt.verify(accessToken, SECRET_KEY) as { user: { id: string; username: string; } }
    req.user = user
    next()
  } catch (err) {
    if (!refreshToken) {
      return res.status(401).json({ message: "Access denied: no valid token" })
    }

    try {
      const { user } = jwt.verify(refreshToken, REFRESH_KEY) as { user: { id: string; username: string; } }
      const accessToken = jwt.sign(
        { user: {
          id: user.id,
          username: user.username
        } }, 
        SECRET_KEY,
        { expiresIn: "15m" }
      )

      res.cookie('accessToken', accessToken, { 
          httpOnly: true, 
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
      });

      req.user = user

      next()
    } catch {
      res.status(400).json({ message: "Invalid token" })
    }
  }
}
