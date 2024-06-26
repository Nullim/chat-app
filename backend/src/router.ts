import { Express } from "express"

import routerAuth from "./modules/auth/auth.router"

function routerApi(app: Express): void {
  app.use('/api/auth', routerAuth)
  // app.use('/api/users')
}

export default routerApi
