import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import CreateService, { getConfiguration, useConfiguration, GlobalState_middleware } from './index'

describe('index test', () => {
	let container = null as any
	beforeEach(() => {
		container = document.createElement('root')
		document.body.appendChild(container)
	})
	afterEach(() => {
		// cleanup on exiting
		unmountComponentAtNode(container)
		container.remove()
		container = null
	})

	it('start match nomal1', () => {
		new CreateService()
	})

	it('start match normal2', () => {
		const app = new CreateService({
			onInjectConfigBefore() {},
			onInjectConfigAfter() {},
			onInjectRouterAfter() {},
			onStarted() {}
		})

		const config = {
			whiteHosts: ['localhost'],
			publicUrl: { baseUrl: 'hello friday' },
			router: {
				baseName: '/'
			}
		}

		// 注入配置
		app.injectConfigurations([config])

		// api 模块插件
		const { middleware } = GlobalState_middleware({ userinfo: 123 })

		app.use(middleware)

		const App = () => {
			const config = useConfiguration()

			return <div>{config.publicUrl.baseUrl}</div>
		}
		// 注入路由
		app.injectRouters(App)

		// 启动器
		app.start('root')

		const getConfigurationResult = getConfiguration()

		expect(getConfigurationResult).toEqual({
			NODE_ENV: 'test',
			history: getConfigurationResult.history,
			...config
		})

		// expect(result).toBeNull()
		expect(container.textContent).toBe('hello friday')
	})
})
