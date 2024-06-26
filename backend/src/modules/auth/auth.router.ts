import express, { Router } from 'express'
import AuthController from './auth.controller'

const router: Router = express.Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)

export default router
