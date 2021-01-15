import MiddlewareService from './middleware.service'

export type { IMiddlewareFC, IMiddlewareService, IMiddleware } from './middleware'

export { default as GlobalState_middleware } from './middlewares/globalState.middleware'

export const middlewareService: MiddlewareService = new MiddlewareService()
