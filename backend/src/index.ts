import express, { Express, Request, Response } from "express"
import { createServer } from "node:http" 
import cors from "cors"
import dotenv from "dotenv"
import { Server } from 'socket.io'

dotenv.config()

const PORT = parseInt(process.env.port as string, 10) || 3000

const app: Express = express()
app.use(express.json())
app.use(cors())

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Skyline")
})

io.on('connection', (socket) => {
  console.log('An user connected with id', socket.id)
  socket.on('disconnect', () => {
    console.log(`User with id ${socket.id} disconnected`)
  })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})