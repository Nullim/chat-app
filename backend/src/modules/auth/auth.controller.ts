import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

import { prisma } from "../../../prisma/prismaConfig"
import { LoginUser, LoginUserSchema, PasswordSchema, RegisterUser, RegisterUserSchema } from "../../../prisma/generated/zod"
import { ERROR_MESSAGE, RECOVERY_KEY, REFRESH_KEY, RESET_KEY, SECRET_KEY, SUCCESS_MESSAGE, VALIDATION_ERROR } from "../../utils/constants"
import { transporter } from "../../utils/email"
import { error } from "console"


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

      userData.password = await bcrypt.hash(userData.password, 10)
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
    if (!refreshToken) return res.status(401).json({ message: ERROR_MESSAGE, error: "No token provided" })
    try {
      const { user } = jwt.verify(refreshToken, REFRESH_KEY) as { user: { id: string; username: string; } }
      const accessToken = jwt.sign(
        { user: {
          id: user.id,
          username: user.username
        }}, 
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
      return res.status(400).json({ message: ERROR_MESSAGE, error: "Invalid token" })
    }
  }
  static async resetPassword (req: Request, res: Response) {
    const password = req.body?.password
    const confirmPassword = req.body?.confirmPassword
    const token = req.cookies['resetToken']

    if (!token) return res.status(400).json({ message: ERROR_MESSAGE, error: "No token provided" })
    if (!password || !confirmPassword) return res.status(204).json({ message: ERROR_MESSAGE, error: "No password provided" })
    if (password != confirmPassword) return res.status(400).json({ message: ERROR_MESSAGE, error: "Passwords do not match" })

    try {
      const { email } = jwt.verify(token, RESET_KEY) as { email: string }

      const validation = await PasswordSchema.spa(password)
      if(!validation.success) {
        return res.status(400).json({ message: ERROR_MESSAGE, error: validation.error})
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword
        }
      })

      return res
        .status(200)
        .clearCookie('resetToken')
        .json({ message: SUCCESS_MESSAGE })
    } catch(err) {
      return res.status(400).json({ message: ERROR_MESSAGE, error: "Invalid token" })
    }
  }

  static async verifyRecoveryCode (req: Request, res: Response) {
    const userCode: string = req.body?.code
    const token = req.cookies['verificationToken']

    if(!token) return res.status(400).json({ message: ERROR_MESSAGE, error: "No token provided" })
    if (!userCode) return res.status(400).json({ message: ERROR_MESSAGE, error: "No code provided" })
    
    try {
      const { code, email } = jwt.verify(token, RECOVERY_KEY) as { code: string, email: string }

      if(userCode != code) return res.status(400).json({ message: ERROR_MESSAGE, error: "Code does not match" })

      const resetToken = jwt.sign({ email: email }, RESET_KEY, {
        expiresIn: "10m",
      })

      return res
        .status(200)
        .clearCookie('verificationToken')
        .cookie('resetToken', resetToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 10 * 60 * 1000,
        })
        .json({ message: SUCCESS_MESSAGE })
    } catch (err) {
      return res.status(400).json({ message: ERROR_MESSAGE, error: "Invalid token" })
    }
  }

  static async passwordRecovery (req: Request, res: Response) {
    const email: string = req.body?.email

    if(!email) return res.status(400).json( { message: ERROR_MESSAGE, error: "No email provided" })

    try {
      const user = await prisma.user.findFirst({
        where: {
          email: email
        }
      })

      if(!user) return res.status(400).json({ message: ERROR_MESSAGE, error: "User not found" })

      const code = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
      const token = jwt.sign({ code: code, email: email }, RECOVERY_KEY, {
        expiresIn: "5m",
      })

      const mailOptions = {
        from: "skyline@admin.com",
        to: email,
        subject: `Skyline Password Reset`,
        html: `
        <!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
          p { display:block;margin:13px 0; }</style><!--[if mso]>
        <noscript>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        </noscript>
        <![endif]--><!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]--><style type="text/css">@media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css"></style></head><body style="word-spacing:normal;"><div><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#1b59f5;vertical-align:top;" width="100%"><tbody><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:0;word-break:break-word;"><div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:white;">Your Password Reset</div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><p style="border-top:solid 4px white;font-size:1px;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px white;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:10px;word-break:break-word;"><div style="font-family:helvetica;font-size:15px;line-height:1;text-align:left;color:white;">Dear ${user.username}, we are sending you this email as per your request to reset your password.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;"><div style="font-family:helvetica;font-size:15px;line-height:1;text-align:left;color:white;">Your password reset code is: ${code}</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;"><div style="font-family:helvetica;font-size:15px;line-height:1;text-align:left;color:white;">If you haven't requested to reset your password, you may safely ignore this email.</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:0;word-break:break-word;"><div style="font-family:helvetica;font-size:15px;line-height:1;text-align:left;color:white;">Thank you!</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:20px;word-break:break-word;"><div style="font-family:helvetica;font-size:15px;line-height:1;text-align:left;color:white;">- The Skyline Team</div></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>
        `
      }

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log(error)
          return res.status(500).json({ message: ERROR_MESSAGE, error: "An error occured while sending the email."})
        }
        return res
          .status(200)
          .cookie('verificationToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 5 * 60 * 1000
          })
          .json({ message: SUCCESS_MESSAGE })
      })
    } catch (err) {
      console.log(err.message)
      return res.status(500).json({ message: ERROR_MESSAGE, error: err.message })
    }
  }
}

export default AuthController
