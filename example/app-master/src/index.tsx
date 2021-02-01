import Friday from 'friday-core'

import micro from 'friday-micro'

import configurations from 'src/configurations'

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

// 发现服务
micro.registerMicroApps([
    {
        name: 'saas-salve',
        entry: '//localhost:3001',
        container: '#micro-layout',
        activeRule: '/app/micro1',
    },
])

micro.start()

serviceWorker.unregister()
