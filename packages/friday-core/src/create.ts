import { IDeferredSerivce } from './process'
import { IRenderService } from './render'
import { IResponseConfiguration, IConfigurationService } from './configuration'
import { IRouterService } from './router'
import { IMiddlewareService } from './middleware'

export interface Options {
	onInjectConfigBefore?: () => void
	onInjectConfigAfter?: (configuration: IResponseConfiguration) => void
	onInjectRouterAfter?: (configuration: IResponseConfiguration) => void
	onStarted?: (configuration: IResponseConfiguration) => void
}

export interface ICreateService extends IDeferredSerivce {
	start(container: string): IRenderService
	use: IMiddlewareService['use']
	injectConfigurations: IConfigurationService['injectConfigurations']
	injectRouters: IRouterService['injectRouters']
}
