import Friday from 'friday-core'

// 如果是微服务中的slave 需要添加该文件在entry 入口上方
// import '@friday/micro/lib/public-path'

import configurations from 'src/configurations'

import sentryLoader from 'src/sentryLoader'

import * as serviceWorker from 'src/serviceWorker'

const app = new Friday({
	onInjectConfigBefore() {
		console.log('onInjectConfigBefore hook')
	},
	onInjectConfigAfter() {
		console.log('onInjectConfigAfter hook')
	},
	onInjectRouterAfter() {
		console.log('onInjectConfigAfter hook')
	},
	onStarted(configuration) {
		const { sentry } = configuration
		sentry && sentryLoader(configuration)
		console.log('onInjectConfigAfter hook')
	}
})

// 注入配置
app.injectConfigurations(configurations)

// api 模块插件
app.use(require('./middleware/axiosMiddleware').default)

// 注入路由
app.injectRouters(require('./App').default)

// 启动器
app.start('#root')

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
