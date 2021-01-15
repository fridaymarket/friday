import invariant from 'invariant'
import warning from 'warning'
import DeferredSerivce from '../process'
import { isArray, isObject, arraysEqual, effectiveObject } from 'friday-helpers'
import { routerServiceInstance } from '../router'
import { IConfigurationService, IResponseConfiguration, IConfiguration } from './configuration'

export class ConfigurationService extends DeferredSerivce implements IConfigurationService {
	private configuration!: IResponseConfiguration

	public getConfiguration = <T = IResponseConfiguration>(): T => {
		return (this.configuration as any) as T
	}

	public injectConfigurations = (
		configurations: IConfiguration[] = []
	): IResponseConfiguration => {
		const { host } = window.location

		const { status, message } = this.validateConfig(configurations)

		invariant(status, message)

		const configurationResult = configurations.filter((o) => {
			return o.whiteHosts.indexOf(host) > -1
		})

		if (isArray(configurationResult) && configurationResult.length == 0) {
			invariant(false, `[configurations whiteHosts] host: ${host} cannot match configuration`)
		}

		if (isArray(configurationResult) && configurationResult.length > 1) {
			warning(
				false,
				'[configurations whiteHosts] host 匹配到了多个config，将使用第一个config'
			)
		}

		this.setConfiguration(configurationResult[0])

		this.inject_finally()

		return this.configuration
	}

	private setConfiguration(configuration: IConfiguration) {
		const { baseName } = configuration.router || {}

		this.configuration = {
			...configuration,
			/**
			 * 在这里注入history的理由是，在非React.FC场景内，无法使用useHistory.
			 * 所以必须提供一个纯函数使用的接口，使用{history} = getConfig() 来调用。
			 * 没有将history暴露成一个独立的api而放在config里，原因是@friday/router已经管理的router
			 * 这里的history是属于core模块的。提供一个独立的调用函数，避免使用者对@friday/router、@firday/core概念混淆
			 */
			history: routerServiceInstance.getHistory({
				basename: baseName
			}),
			NODE_ENV: process.env.NODE_ENV!
		}

		return this.configuration
	}

	private validateConfig(configurations: IConfiguration[]) {
		return configurations.reduce(
			(pre, c) => {
				if (pre.status && !isArray(c.whiteHosts)) {
					pre.status = false
					pre.message = `[configurations whiteHosts] should be array, but got ${typeof c.whiteHosts}`
				}

				if (pre.status && !isObject(c.publicUrl)) {
					pre.status = false
					pre.message = `[configurations publicUrl] should be object, but got ${typeof c.publicUrl}`
				}

				if (
					pre.status &&
					effectiveObject(pre.prePublicUrlMap) &&
					!arraysEqual(Object.keys(pre.prePublicUrlMap), Object.keys(c.publicUrl))
				) {
					pre.status = false
					pre.message = `配置中的publicUrl key不一致，请保持一致，否则可能导致某个环境下出现异常`
				}

				pre.prePublicUrlMap = c.publicUrl

				return pre
			},
			{
				status: true,
				message: '',
				prePublicUrlMap: {} as object
			}
		)
	}
}
