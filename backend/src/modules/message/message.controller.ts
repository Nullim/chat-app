import { prisma } from "../../../prisma/prismaConfig"

class MessageController {
  static async getMessages(roomId: number) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          roomId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              username: true
            }
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 100,
      })
      return messages
    } catch(err) {
      throw new Error(err)
    }
  }

  static async getLostMessages(roomId: number, serverOffset: Date) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          roomId,
          createdAt: {
            gt: serverOffset
          }
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              username: true
            }
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 100
      })

      return messages
    } catch (err) {
      throw new Error()
    }
  }

  static async createMessage(userId: string, roomId: number, messageContent: string) {
    try {
      const message = await prisma.message.create({
        data: {
          content: messageContent,
          user: {
            connect: {
              id: userId
            }
          },
          room: {
            connect: {
              id: roomId
            }
          },
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              username: true
            }
          },
          room: {
            select: {
              name: true
            }
          }
        }
      })
      return message
    } catch (err) {
      throw new Error(err)
    }
  }
}

export default MessageController