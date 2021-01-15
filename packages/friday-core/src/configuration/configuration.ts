import { IDeferredSerivce } from '../process'
import { History } from 'history'

export interface IConfiguration {
	whiteHosts: string[]
	publicUrl: MapObject
	router?: {
		baseName?: string
	}
	sentry?: MapObject
	[x: string]: any
}

export interface IResponseConfiguration extends IConfiguration {
	history: History
	NODE_ENV: string
}

export interface IConfigurationService extends IDeferredSerivce {
	getConfiguration<T = IResponseConfiguration>(): T
	injectConfigurations(configurations: IConfiguration[]): IResponseConfiguration
}
