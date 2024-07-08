import express, { Router } from 'express'
import RoomController from './room.controller'
import { verifyToken } from '../../middleware/auth'

const router: Router = express.Router()

router.get('/', RoomController.getAllRooms)
router.get('/user', verifyToken, RoomController.getUserRooms)

export default router
