import { Request, Response } from "express"

import { prisma } from "../../../prisma/prismaConfig"
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../utils/constants"
import { ValidationRequest } from "../../utils/types"

class RoomController {
  static async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await prisma.room.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              users: true,
            }
          }
        }
      })
      return res.status(200).json({ message: SUCCESS_MESSAGE, rooms })
    } catch(err) {
      return res.status(500).json({ message: ERROR_MESSAGE, error: err.message })
    }
  }
  
  static async getUserRooms(req: ValidationRequest, res: Response) {
    try {
      const userId = req?.user?.id

      if (!userId) return res.status(400).json({ message: ERROR_MESSAGE, error: "No user ID provided" })

      const rooms = await prisma.room.findMany({
        select: {
          id: true,
          name: true,
          users: {
            where: {
              id: userId
            }
          }
        }
      })

      return res.status(200).json({ message: SUCCESS_MESSAGE, rooms })
    } catch (err) {
      return res.status(500).json({ message: ERROR_MESSAGE, error: err.message })
    }
  }

  static async fetchUserRooms(userId: string) {
    try {
      const rooms = await prisma.room.findMany({
        select: {
          id: true,
          name: true,
          users: {
            where: {
              id: userId
            },
          }
        }
      })

      return rooms
    } catch (err) {
      throw new Error(err)
    }
  }

  static async fetchRooms() {
    try {
      const rooms = await prisma.room.findMany({
        select: {
          id: true,
          name: true,
        }
      })

      return rooms
    } catch(err) {
      throw new Error(err)
    }
  }
  
  static async addUserToRoom(username: string, roomId: number) {
    try {
      await prisma.room.update({
        where: { id: roomId },
        data: {
          users: {
            connect: { username }
          }
        }
      })
    } catch(err) {
      throw new Error(err)
    }
  }

  static async removeUserFromRoom(username: string, roomId: number) {
    try {
      await prisma.room.update({
        where: { id: roomId },
        data: {
          users: {
            disconnect: { username }
          }
        }
      })
    } catch(err) {
      throw new Error(err)
    }
  }
}

export default RoomController
