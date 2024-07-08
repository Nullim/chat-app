import dotenv from "dotenv"
dotenv.config()

import cookieParser from "cookie-parser"
import cors from "cors"
import { createServer } from "node:http" 
import { Server } from 'socket.io'
import express, { Express, Request, Response } from "express"


import routerApi from "./router"
import { BASE_URL, PORT } from "./utils/constants"
import { setupSocketHandlers } from "./websockets/socketHandlers"

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
  connectionStateRecovery: {}
})

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Skyline")
})

routerApi(app)
setupSocketHandlers(io)

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
