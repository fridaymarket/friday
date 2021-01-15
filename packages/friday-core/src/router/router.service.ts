import invariant from 'invariant'
import DeferredSerivce from '../process'
import { isFunction } from 'friday-helpers'
import { IRouterService, InjectProps } from './router'
import { createBrowserHistory, BrowserHistoryBuildOptions } from 'friday-router'

export default class RouterService extends DeferredSerivce implements IRouterService {
	private Router!: React.FC<InjectProps>

	public injectRouters = (Router: React.FC<InjectProps>) => {
		invariant(
			isFunction(Router),
			`[inject router] component should be function, but got ${typeof Router}`
		)

		this.Router = Router

		this.inject_finally()
	}

	public getRouter = (extraProps: InjectProps) => {
		return this.Router(extraProps)!
	}

	public getHistory(options: BrowserHistoryBuildOptions) {
		return createBrowserHistory(options)
	}
}
