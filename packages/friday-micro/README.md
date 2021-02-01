

# friday-micro 

`friday-micro` 基于`qiankun`，提供了`qiankun`的基础能力之外，封装了一些扩展和配置。在应用需要使用微服务时，需要安装到这个模块。

## 安装

```bash
$ npm install friday-micro --save 

or 

$ yarn add friday-micro --save 
```

`friday-micro`可以脱离`friday`框架单独使用

## 配置一个微服务
#### master 

```javascript

import micro from 'friday-micro'

micro.registerMicroApps([{
  // slave name
  name: 'slave-project', // app name registered
  // slave的远端地址
  entry: '//localhost:3001',
  // slave 服务的dom地址
  container: '#subapp-viewport',
  // 触发这个slave
  activeRule: '/react16',
}])
// 启动微服务， 这个start和 app.start不同， micro.start 在start之后，可以选择场景触发。
micro.start()

```

#### slave
slave 只需要将服务接口暴露出来即可。webpack配置`friday-template` 已经配置好，无需修改

```js
import Friday from 'friday-core'
// 微服务中的slave 需要添加该文件在entry 入口上方，用来添加静态资源地址
import '@friday/micro/lib/public-path'

const lifecycle = app.start('#root')

export const bootstrap = lifecycle.bootstrap

export const mount = lifecycle.mount

export const unmount = lifecycle.unmount

```
`slave` 应用需要配置一下`webpack`将微服务的出口暴露出来	：

在`friday-template`中的`config-override.js`中可以看到下方三个配置项，分别功能为：
- `devServerCorsOrHeader` 添加cors，在开发环境中进行跨域
- `OverrideMicroOutPut` 暴露微服务出口
- `addEntryAttribute` 微服务标记出口文件

```js
const { 
  devServerCorsOrHeader, 
  OverrideMicroOutPut, 
  addEntryAttribute  
} = require('@friday/micro-webpack-plugin')

module.exports = {
  webpack: override(
    ...
    // 微服务暴露出口
    OverrideMicroOutPut(packageName),
    // 微服务标记出口文件
    addWebpackPlugin(
      addEntryAttribute()
    )
  ),
  devServer: overrideDevServer(
    // 添加cors
    devServerCorsOrHeader()
  )
}
```



## API 
#### qiankun api
`friday-micro`继承qiankun所有的方法，在这就不多叙述

### inMicroservice(): boolean

`inMicroservice`提供判断应用是否在微服务应用中的能力，返回一个`boolean`

### DevelopmentLogin: React.FC
`DevelopmentLogin`是个react组件，提供了一个通用的微服务登录页面，用于在脱离`master`应用之后也能独立运行

```javascript
interface DevelopmentLogin {
  title?: string
  onSumbit(username: string, password: string): void
}

const DevelopmentLogin: React.FC<DevelopmentLogin>
```
### public-path.js

如果是微服务中的slave应用中，我们需要通过`__webpack_public_path__`变量将静态资源动态导入到`webpack`中，所以需要添加该文件在entry 入口上方引入
`public-path.js`静态文件。 用法如下

```javascript

import 'friday-micro/lib/public-path'
```




