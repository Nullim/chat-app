import { z } from "zod"

export const LoginUserSchema = z
  .object({
    username: z.string().min(6, "Invalid Username").trim(),
    password: z.string().min(6, "Invalid Password"),
  })

export type LoginUser = z.infer<typeof LoginUserSchema>

export const RegisterUserSchema = z
  .object({
    username: z
      .string({
        required_error: 'Username is required'
      })
      .min(6, 'Username must have at least 8 characters')
      .max(20, 'Username cannot be longer than 20 characters')
      .trim(),
    password: z
      .string({
        required_error: 'Password is required'
      })
      .min(6, 'Password must have at least 6 characters'),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required'
      }),
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: "Passwords do not match",
      path: ['confirmPassword']
    }
  )
  .superRefine(({ password }: { password: string }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch)
    const containsLowercase = (ch: string) => /[a-z]/.test(ch)
    
    let countOfUppercase = 0,
        countOfLowercase = 0,
        countOfNumbers = 0;
    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i)
      if (!isNaN(+ch)) countOfNumbers++
      else if (containsUppercase(ch)) countOfUppercase++
      else if (containsLowercase(ch)) countOfLowercase++
    }
    if (countOfNumbers < 1 || countOfUppercase < 1 || countOfLowercase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must have at least one number, an uppercase letter and a lowercase letter",
        path: ['password'],
      })
    }
  })

export type RegisterUser = z.infer<typeof RegisterUserSchema>
