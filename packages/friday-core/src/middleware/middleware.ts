import { IConfiguration } from '../configuration'

export interface IMiddlewareProps {
	App: (props: any) => JSX.Element
	configuration: IConfiguration
}

export type IMiddlewareFC = (params: IMiddlewareProps) => IMiddlewareProps

export type IMiddleware = (props: IMiddlewareProps) => IMiddlewareProps

export interface IMiddlewareService {
	use(middleware: IMiddleware): void
	apply(props: IMiddlewareProps): void
	getMiddleware(): IMiddleware[]
}
