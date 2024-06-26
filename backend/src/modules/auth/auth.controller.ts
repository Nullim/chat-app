import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { prisma } from "../../../prisma/prismaConfig"
import { LoginUser, LoginUserSchema, RegisterUser, RegisterUserSchema } from "../../../prisma/generated/zod"
import { REFRESH_KEY, SECRET_KEY } from "../../utils/constants"


class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const loginData: LoginUser = req.body

      const validation = await LoginUserSchema.spa(loginData)
      if (!validation.success) {
        return res.status(400).json(validation.error)
      }

      const user = await prisma.user.findUnique({
        where: {
          username: loginData.username
        }
      })

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const passwordMatch = await bcrypt.compare(loginData.password, user.password)
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" })
      }

      const accessToken = jwt.sign(
        { user: user.id }, 
        SECRET_KEY,
        { expiresIn: "15m" }
      )

      const refreshToken = jwt.sign(
        { user: user.id},
        REFRESH_KEY,
        { expiresIn: "30d" }
      )

      res.header('Authorization', accessToken)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      
      return res.status(200).json({ user: user.id })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const userData: RegisterUser = req.body

      const validation = await RegisterUserSchema.spa(userData)
      if(!validation.success) {
        return res.status(400).json(validation.error)
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          email: userData.email
        }
      })

      if (existingUser) {
        return res.status(409).json({ message: "Email is already linked to an existing account" })
      }

      const user = await prisma.user.create({
        data: userData
      })
    
      return res.status(201).json({ message: "User created successfully"})
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }
}

export default AuthController
