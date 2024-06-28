import dotenv from "dotenv"
dotenv.config()

import express, { Express, Request, Response } from "express"
import cookieParser from "cookie-parser"
import { createServer } from "node:http" 
import cors from "cors"
import { Server } from 'socket.io'
import routerApi from "./router"
import { BASE_URL, PORT } from "./utils/constants"

const app: Express = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: BASE_URL,
  credentials: true
}))

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: BASE_URL,
    methods: ['GET', 'POST'],
  },
})

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Skyline")
})

routerApi(app)

/*
io.on('connection', (socket) => {
  console.log('An user connected with id', socket.id)
  socket.on('disconnect', () => {
    console.log(`User with id ${socket.id} disconnected`)
  })
})
*/

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
