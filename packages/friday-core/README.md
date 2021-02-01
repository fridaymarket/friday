

# friday-core 

`friday-core` 是`friday`的纽带，它连接了应用配置、应用视图等一系列，又打散了业务。


## 安装

```bash
$ npm install friday-core --save 

or 

$ yarn add friday-core --save 
```


## example 

```javascript
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

**有以下特性**：
- 支持多配置，`friday-core`根据`whiteHosts`自动规划配置作为当前配置，便于环境拆分。
```javascript
// configuration.dev
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

```javascript
// configurations.ts
import configuration_dev from './configuration.dev'
import configuration_pro from './configuration.pro'

const configurations = [
  configuration_dev,
  configuration_pro,
]
export default configurations
```
- 业务中间件灵活插拔。我们可以选择给friday注册一些中间件，便于抽象和扩展一些业务,`friday-core`内置了一些常规中间件

```javascript
import { GlobalState_middleware } from 'friday-core'

export const { middleware: global_middleware, useGlobalContext } = GlobalState_middleware({ 
  userInfo: {} as IUserInfo,
  globalLoading: false
})

export default global_middleware

```
上面的中间件提供了管理全局变量的能力，我们可以自定义中间件，来让业务。

tips: 我们可以通过中间件来管理`friday-async`的全局配置。

- 生命周期钩子。提供三方插件和应用的配置的纽带
我们可以在生命周期钩子中，来开启一些三方库。
```javascript
// 开启站点监测，将分发当前环境的配置
const app = new Friday({
  onStarted(configuration) {
	const { sentry } = configuration
	sentry && sentryLoader(configuration)
  }
})
```

- 微服务的生命周期钩子。
`friday-core` 提供了基于`qiankun`微服务的生命周期钩子，你可以暴露出去，将friday注册到其他微服务平台内

```javascript
// 微服务中的slave 需要添加该文件在entry 入口上方，用来添加静态资源地址
import 'friday-micro/lib/public-path'

const lifecycle = app.start('#root')

export const bootstrap = lifecycle.bootstrap
export const mount = lifecycle.mount
export const unmount = lifecycle.unmount

```

### friday-core Api

#### app = Friday(opts)

创建应用，返回 Friday 实例
opts包含:

- `onInjectConfigBefore()` 调用`injectConfig`之前执行
- `onInjectConfigAfter(configurations)` 调用`injectConfig`之后执行, `configurations`为当前匹配的config
- `onInjectRouterAfter(configurations)` 调用`injectRouters`之后执行, `configurations`为当前匹配的`config`
- `onStarted(config)` 调用`start`之后执行, `config`为当前匹配的`config`



#### app.injectConfigurations(configurations: IConfiguration[])

配置项目`configurations`, `whiteHosts`中为匹配目标，多个`configuration`被匹配，将取第一个
```js
interface IConfiguration {
    whiteHosts: string[]
    publicUrl: {
        [x: string]: any
    }
    router?: {
        baseName: string
    },
    sentry?: boolean
}
```

#### configResult = useConfiguration() or getConfiguration()

`configResult` 与注入的`configuration`有所不同，多了两个属性:

```js
interface IResponseConfiguration extends IConfiguration {
    // 传入router.baseName后，暴露的history
    history: History
    // 当前执行环境
    NODE_ENV: string
}
```
`friday-core`支持不同方式获取`configuration` `useConfiguration` 在`react`组件内使用，而`getConfiguration()`可以在非`react`组件内使用


#### app.use(middleware: IMiddleware)

`friday`支持中间件，通过中间件结构部分业务，目前`friday`提供了部分封装好的中间件

```js

import { GlobalState_middleware } from 'friday-core'

const {middleware, useGlobalContext } = GlobalState_middleware({userInfo: { name: 'friday' }})

app.use(middleware)

```

#### app.injectRouters(Router: React.FC)

配置项目的组件入口，`Router`如下：

```js
const App = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path='/' component={Home} />
      </Switch>
    </Router>
  )
}

export default App

app.injectRouters(App)

```
#### microLsifecycle= app.start(container: string)

启动项目,`container`为一个DOM元素的`ID`

`microLsifecycle` 为项目的微服务暴露函数，在微服务的子应用应该将其暴露出来，包含以下函数。

- bootstrap
- mount
- unmount
- render

