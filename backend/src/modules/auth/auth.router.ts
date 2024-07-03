import express, { Router } from 'express'
import AuthController from './auth.controller'

const router: Router = express.Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/logout', AuthController.logout)
router.post('/verify', AuthController.verifyToken)
router.post('/recovery', AuthController.passwordRecovery)
router.post('/verify-recovery', AuthController.verifyRecoveryCode)
router.patch('/reset-password', AuthController.resetPassword)

export default router
