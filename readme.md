
# Welcome to Friday

[![codecov](https://codecov.io/gh/fridaymarket/friday/branch/main/graph/badge.svg?token=WG595IXI67)](https://codecov.io/gh/fridaymarket/friday)
[![Build Status](https://travis-ci.com/fridaymarket/friday.svg?branch=main)](https://travis-ci.com/fridaymarket/friday)
![npm](https://img.shields.io/npm/v/friday-async)

Friday makes state and view management easier, aggregates a series of basic capabilities, and makes react applications looser.

## Features
- API generation ability, Abandon Redux, Based On SWR
- Support Micro, Based On QianKun
- Middleware System
- Set up Friday app by running one command.
- more...

## Getting started

```bash

& npx create-react-app --scripts-version 4.0.0-next.64 [project-name] --template friday-library

& cd [project-name]

& yarn start

# After a few seconds, you will see the following output:

Compiled successfully!

You can now view friday-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.7.35:3000

Note that the development build is not optimized.
To create a production build, use yarn build.

```

## Example

The configuration module of the project, which configuration to use depends on whether the whiteHosts match.

The configuration can be obtained through  `useConfiguration` or `getConfiguration`

```js
// configurations.ts 

import { IConfiguration } from 'friday-core'

const { protocol } = document.location

const configuration_dev: IConfiguration = {
  whiteHosts: ['localhost:3000'],
  publicUrl: {
    baseUrl: 'http://localhost:3000/mock/8/test'
  }
}

const configuration_Pro: IConfiguration = {
  whiteHosts: ['localhost:3001'],
  publicUrl: {
    baseUrl: 'http://localhost:3001/mock/8/test'
  }
}

const configurations = [
  configuration_dev, 
  configuration_pro
]

export default configuration
```

Middleware module, which can abstract business, such as: internationalization, etc.

```js
// middlewares.ts

import { getConfiguration, GlobalState_middleware } from 'friday-core'

import { httpAxios, request_middleware } from 'friday-async'

// aixos middleware, provided to friday-async
const axios_middleware = request_middleware({
  axiosInstance: httpAxios({
    baseURL: getConfiguration().publicUrl
  })
})
// global middleware
const { middleware: global_middleware, useGlobalContext } = GlobalState_middleware({ 
  userInfo: {} as IUserInfo,
  globalLoading: false
})

const middlewares = [
  axios_middleware,
  global_middleware,
]
export default middlewares
```

The `App.ts` shows friday's business capabilities, examples of api creation to use

```js
// App.ts

import React from 'react'
import { Switch, Route, Router } from 'friday-router'
import { createGetApi, useRequest } from 'friday-async'

const getUser = createGetApi<{id: number},{name: string, token: string}>({ url: '/getUser' })

const Home = () => {

  const { dataJson } = useRequest(getUser({id: 1}))

  return (
    <div>{dataJson.name}</div>
  )
}

const App = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  )
}

export default App
```

The injection of `configurations`、`middlewares` and `App` is orderly because they will depend on each other

```js
// index.ts

import Friday from 'friday-core'
import configurations from './configurations'

const app = new Friday()

app.injectConfigurations(configurations)

app.use(require('./middlewares').default)

app.injectRouters(require('./App').default)

app.start('#root')

```

If you need microservice support. 

```js 

// master project. 

import micro from 'friday-micro'

micro.registerMicroApps([{
  // slave name
  name: 'slave-project', // app name registered
  entry: '//localhost:3000',
  container: '#subapp-viewport',
  activeRule: '/react16',
}])
// start micro project
micro.start()

```
First, you need to register the slave service in the master application

```js 

// slave project. 

import Friday from 'friday-core'
// The slave in the microservice needs to add this file above the entry entry to add static resource addresses
import 'friday-micro/lib/public-path'

const lifecycle = app.start('#root')

export const bootstrap = lifecycle.bootstrap

export const mount = lifecycle.mount

export const unmount = lifecycle.unmount

```
You only need to expose the microservice interface in the slave。`friday-template` has helped you configure the webpack of microservices








## Documentation
* [friday-core](https://github.com/fridaymarket/friday/blob/main/packages/friday-core/README.md) 
> friday core, Provide microservices, application configuration, application view coupling, middleware and other capabilities

* [friday-async](https://github.com/fridaymarket/friday/blob/main/packages/friday-async/README.md) 
> `friday`'s data flow management method, abandoning the redux data flow management method, based on swr

* [friday-micro](https://github.com/fridaymarket/friday/blob/main/packages/friday-micro/README.md) 
> `friday-micro` Provide the scalability of microservices

* [friday-template](https://github.com/fridaymarket/friday/blob/main/packages/friday-template/README.md)

> `friday-template` Provides the ability to quickly create `friday` applications







