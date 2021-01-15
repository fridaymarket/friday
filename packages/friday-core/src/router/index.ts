export type { IRouterFunc, IRouterService, InjectProps } from './router'

import RouterService from './router.service'

export const routerServiceInstance: RouterService = new RouterService()
