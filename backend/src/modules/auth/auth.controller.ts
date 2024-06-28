import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { prisma } from "../../../prisma/prismaConfig"
import { LoginUser, LoginUserSchema, RegisterUser, RegisterUserSchema } from "../../../prisma/generated/zod"
import { ERROR_MESSAGE, REFRESH_KEY, SECRET_KEY, SUCCESS_MESSAGE, VALIDATION_ERROR } from "../../utils/constants"


class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const loginData: LoginUser = req.body
      const validation = await LoginUserSchema.spa(loginData)
      if (!validation.success) {
        return res.status(400).json({ message: VALIDATION_ERROR, error: validation.error })
      }

      const user = await prisma.user.findUnique({
        where: {
          username: loginData.username
        }
      })

      if (!user) {
        return res.status(404).json({ message: ERROR_MESSAGE, error: "User not found" })
      }

      const passwordMatch = await bcrypt.compare(loginData.password, user.password)
      if (!passwordMatch) {
        return res.status(401).json({ message: ERROR_MESSAGE, error: "Invalid password" })
      }

      const accessToken = jwt.sign(
        { user: {
          id: user.id,
          username: user.username
        } }, 
        SECRET_KEY,
        { expiresIn: "15m" }
      )

      const refreshToken = jwt.sign(
        { user: {
          id: user.id,
          username: user.username
        } }, 
        REFRESH_KEY,
        { expiresIn: "30d" }
      )

      res
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        })
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
      
      return res.status(200).json({ 
        message: SUCCESS_MESSAGE, 
        user: {
          id: user.id,
          username: user.username
        },
      })
    } catch (err) {
      return res.status(500).json({ message: ERROR_MESSAGE, error: err.message })
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const userData: RegisterUser = req.body
      userData.role = 'USER'
      userData.password = await bcrypt.hash(userData.password, 10)

      const validation = await RegisterUserSchema.spa(userData)
      if(!validation.success) {
        return res.status(400).json({ message: ERROR_MESSAGE, error: validation.error})
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          email: userData.email
        }
      })

      if (existingUser) {
        return res.status(409).json({ message: ERROR_MESSAGE, error: "Email is already linked to an existing account" })
      }

      await prisma.user.create({
        data: userData
      })
    
      return res.status(201).json({ message: SUCCESS_MESSAGE })
    } catch (err) {
      return res.status(500).json({ message: ERROR_MESSAGE, error: err.message })
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
  
      res.json({ message: SUCCESS_MESSAGE })
    } catch(err) {
      return res.status(500).json({ message: ERROR_MESSAGE, error: err.message })
    }
  }

  static async verifyToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) return res.status(401).json({ message: "Access denied: no token provided" })
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

      return res
        .cookie('accessToken', accessToken, { 
          httpOnly: true, 
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        })
        .status(200)
        .json(user)
    } catch (err) {
      return res.status(400).json({ message: "Invalid token" })
    }
  }
}

export default AuthController
