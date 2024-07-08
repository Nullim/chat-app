import { Express } from "express"

import routerAuth from "./modules/auth/auth.router"
import routerRooms from "./modules/room/room.router"

function routerApi(app: Express): void {
  app.use('/api/auth', routerAuth)
  app.use('/api/rooms', routerRooms)
}

export default routerApi
