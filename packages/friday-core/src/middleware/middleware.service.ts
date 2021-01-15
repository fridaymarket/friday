import compose from 'compose-function'
import invariant from 'invariant'
import DeferredSerivce from '../process'
import { isFunction, isArray } from 'friday-helpers'
import { IMiddlewareService, IMiddleware, IMiddlewareProps } from './middleware'

export default class MiddlewareService extends DeferredSerivce implements IMiddlewareService {
	private middleware: IMiddleware[] = []

	constructor() {
		super()
	}

	public use = (middleware: IMiddleware | IMiddleware[]) => {
		invariant(
			isFunction(middleware) || isArray(middleware),
			`[MiddlewareService use] middleware should be function or function[], but got ${typeof middleware}`
		)

		if (isArray(middleware)) {
			middleware.forEach((m) => {
				this.middleware.push(m)
			})
			return
		}

		this.middleware.push(middleware)
	}

	public apply = (params: IMiddlewareProps): IMiddlewareProps['App'] => {
		this.inject_finally()
		const composition = compose(...this.middleware)
		const { App } = composition(params) as IMiddlewareProps
		return App
	}

	public getMiddleware = (): IMiddleware[] => {
		return this.middleware
	}
}
