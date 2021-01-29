

# friday-core 
--- 
`friday-core` 是`friday`的纽带，它连接了应用配置、应用视图等一系列，又打散了业务。


## example 

```

import Friday from 'friday-core'

import configurations from 'src/configurations'

const app = new Friday({
  onInjectConfigBefore() {},
  onInjectConfigAfter() {},
  onInjectRouterAfter(configuration) {},
  onStarted(configuration) {}
})

// 注入配置
app.injectConfigurations(configurations)

// api 模块插件
app.use(require('./middlewares').default)

// 注入路由
app.injectRouters(require('./App').default)

// 启动
app.start('#root')

```
`friday-core`将应用划分为三个模块，配置、插件、应用业务。

有以下特性：
- 支持多配置，`friday-core`根据`whiteHosts`自动规划配置作为当前配置，便于环境拆分。
```
# configuration.dev
import { IConfiguration } from 'friday-core'


const whiteHosts = [
  'localhost:3000'
]

const configuration: IConfiguration = {
  whiteHosts,
  publicUrl: {
	BASE_API_URL: 'http://127.0.0.1:3000/api',
  }
}

export default configuration
```

```
# configurations.ts

import configuration_dev from './configuration.dev'
import configuration_pro from './configuration.pro'

const configurations = [
  configuration_dev,
  configuration_pro,
]

export default configurations

```
- 业务中间件灵活插拔。我们可以选择给friday注册一些中间件，便于抽象和扩展一些业务,`friday-core`内置了一些常规中间件


```

import { GlobalState_middleware } from 'friday-core'

export const { middleware: global_middleware, useGlobalContext } = GlobalState_middleware({ 
  userInfo: {} as IUserInfo,
  globalLoading: false
})

export default global_middleware

```
上面的中间件提供了管理全局变量的能力，我们可以自定义中间件，来让业务结偶。

tips:我们可以通过中间件来管理`friday-async`的全局配置。

- 生命周期钩子。提供三方插件和应用的配置的纽带
我们可以在生命周期钩子中，来开启一些三方库。
```
# 开启站点监测，将分发当前环境的配置
const app = new Friday({
  onStarted(configuration) {
	const { sentry } = configuration
	sentry && sentryLoader(configuration)
  }
})
```

- 微服务的生命周期钩子。
`friday-core` 提供了基于`qiankun`微服务的生命周期钩子，你可以暴露出去，将friday注册到其他微服务平台内

```
# 微服务中的slave 需要添加该文件在entry 入口上方，用来添加静态资源地址
import 'friday-micro/lib/public-path'

const lifecycle = app.start('#root')

export const bootstrap = lifecycle.bootstrap

export const mount = lifecycle.mount

export const unmount = lifecycle.unmount

```





