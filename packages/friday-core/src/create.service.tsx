import React from 'react'
import invariant from 'invariant'
import { isFunction } from 'friday-helpers'
import RenderService from './render'
import DeferredSerivce from './process'
import { routerServiceInstance, InjectProps } from './router'
import { ICreateService, Options } from './create'
import { middlewareService, IMiddleware } from './middleware'
import { configurationService, IConfiguration } from './configuration'

export default class CreateService extends DeferredSerivce implements ICreateService {
	private _options!: Options

	constructor(options: Options = {} as Options) {
		super()
		this._options = options
	}

	public injectConfigurations = (configurations: IConfiguration[]) => {
		const { onInjectConfigBefore, onInjectConfigAfter } = this._options

		isFunction(onInjectConfigBefore) && onInjectConfigBefore!()

		const configuration = configurationService.injectConfigurations(configurations)

		isFunction(onInjectConfigAfter) && onInjectConfigAfter!(configuration)

		return configuration
	}

	public use = (middleware: IMiddleware) => {
		invariant(!this.deferred, '[middleware] middleware must be registered before app.start()')

		middlewareService.use(middleware)
	}

	public injectRouters = (Router: React.FC<InjectProps>) => {
		const { onInjectRouterAfter } = this._options

		invariant(
			configurationService.deferred,
			`[inject router] configuration must be registered before app.injectRouters()`
		)

		routerServiceInstance.injectRouters(Router)

		const configuration = configurationService.getConfiguration()

		isFunction(onInjectRouterAfter) && onInjectRouterAfter!(configuration)
	}

	public start = (container: string) => {
		invariant(
			container && document.querySelector(container),
			`[app.start] container ${container} not found`
		)
		// validate configuration
		invariant(
			configurationService.deferred,
			`[inject configuration] configuration must be registered before app.start()`
		)
		// validate router status
		invariant(
			routerServiceInstance.deferred,
			`[inject router] router must be registered before app.start()`
		)

		// 获取注入的component， 并调用compoent middleware逻辑
		const RootComponent = this.getRootComponent()

		const renderService = new RenderService(container, RootComponent)
		// render component , 关联了微服务逻辑
		renderService.render()
		// 更改状态
		this.inject_finally()

		const { onStarted } = this._options

		isFunction(onStarted) && onStarted!(configurationService.getConfiguration())

		// 返回renderService，对外提供微服务业务
		return renderService
	}

	private getRootComponent(): React.FC<any> {
		const configuration = configurationService.getConfiguration()

		const Provider = middlewareService.apply({
			// props middleware循环下来的props
			App: (props) =>
				// 获取inject router的组件, 并将所有中间件传递下来的props 注入
				routerServiceInstance.getRouter({
					history: configuration.history,
					// config: configuration,
					configuration: configuration,
					...props
				}),
			// config: configuration,
			configuration
		})

		// warpProps 微服务的master传递的props
		return (warpProps) => <Provider {...warpProps} />
	}
}
