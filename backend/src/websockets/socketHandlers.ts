import { Server, Socket } from "socket.io"
import MessageController from "../modules/message/message.controller"
import RoomController from "../modules/room/room.controller"

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const setupRoomHandlers = async () => {
      try {
        const rooms = await RoomController.fetchRooms()

        // TODO: Implement user logic for synchronizing user state
        // with global state after momentarily losing connection.
        /*
        if(socket.recovered) {
          const userId = socket.handshake.auth.userId
          const serverOffset = socket.handshake.auth.serverOffset
          const userRooms = await RoomController.fetchUserRooms(userId)

          await Promise.all(userRooms.map(async (room) => {
            try {
              const messages = await MessageController.getLostMessages(room.id, serverOffset)
              socket.emit(`${room.name}Messages`, messages)
            } catch (err) {
              console.error('Failed to reconnect: ' + err)
            }
          }))
        }
        */

        rooms.forEach(room => {
          const joinEvent = `join${room.name}`

          socket.on(joinEvent, async (username: string) => {
            try {
              const messages = await MessageController.getMessages(room.id)

              if(messages) {
                await RoomController.addUserToRoom(username, room.id)
                
                socket.join(room.name)
                io.to(room.name).emit("userJoined", `${username} joined the room.`)
                socket.emit(`${room.name}Messages`, messages)
              }
            } catch (err) {
              socket.emit('error', 'Could not join room')
            }
          })
        })
      } catch (err) {
        throw new Error(err)
      }
    }

    setupRoomHandlers()

    socket.on('leaveRoom', async(username: string, roomId: number, roomName: string) => {
      try {
        await RoomController.removeUserFromRoom(username, roomId)
        socket.leave(roomName)
        io.to(roomName).emit("userLeft", `${username} left the room.`)
      } catch (err) {
        socket.emit('error', 'Could not leave room')
      }
    })

    socket.on('newMessage', 
      async (
        userId: string,
        roomId: number, 
        messageContent: string,
      ) => {
        try {
          const message = await MessageController.createMessage(userId, roomId, messageContent)
          io.to(message.room.name).emit('newMessage', message)
        } catch (err) {
          socket.emit('error', 'Could not send message')
        }
    })

    socket.on('disconnect',)
  })
}
