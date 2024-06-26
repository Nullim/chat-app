import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { SECRET_KEY, REFRESH_KEY } from "../utils/constants"

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers['authorization'] as string
  const refreshToken = req.cookies['refreshToken'] as string

  if (!accessToken && !refreshToken) return res.status(401).json({ message: "Access denied" })
  
  try {
    const { userId } = jwt.verify(accessToken, SECRET_KEY) as { userId: string }
    (req as any).user = userId
    next()
  } catch (err) {
    if (!refreshToken) {
      return res.status(401).json({ message: "Access denied"})
    }

    try {
      const { userId } = jwt.verify(REFRESH_KEY, refreshToken) as { userId: string }
      const accessToken = jwt.sign(
        { user: userId },
        SECRET_KEY,
        { expiresIn: '15m' }
      )

      res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .header('Authorization', accessToken)
        .json({ user: userId })
    } catch {
      res.status(400).json({ message: "Invalid token" })
    }
  }
}
