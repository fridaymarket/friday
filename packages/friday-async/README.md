

# friday-async 

`friday-async` 抛弃了redux数据流管理方式，全面拥抱hooks生态, 同时还支持纯函数的async能力，简化应用复杂度之下，还大大提升研发效率。

## 安装

```bash
$ npm install friday-async --save 

or 

$ yarn add friday-async --save 
```
`friday-async`可以脱离`friday`框架单独使用

## friday-async的理念

在以往`redux`库下的`react`应用，`redux`所承担的可能是一个全局状态管理，一个单向数据流，但是在某些应用下，我们未必需要管理大量的全局状态和需要一个管理状态和视图的工具。

很多时候我们使用`redux`只需要它的异步请求。在`react hooks`到来之后，我们尝试放弃单向数据流，因为它带来的更多大量的重复工作和样板代码，所以我们借鉴`swr`的思想来封装一个请求器。让状态和视图管理更加简单，耦合更松散。



## 创建并使用一个api

`friday-async` 提供 `createGetApi | createPostApi` 来生成一个api配置

`createGetApi | createPostApi` 生成的`api`可以同时给`useRequest | dispatchAsync`使用，做到一次生成，随地使用，同时能自动推导输入输出的类型定义，开发重构有更多的保障

```javascript
import { createGetApi, useRequest, dispatchAsync } from 'friday-async'

interface RequestParams {
  id: number
}
interface ResponseData {
  id: number
  name: string
}

const getUserInfo = createGetApi<RequestParams,ResponseData[]>({
  url: '/userInfo'
})

// 应用在react hook中
const APP = () => {
  // 当参数改变，useRequest会自动监测并重新fetch
  const { dataArray } = useRequest(getUserInfo({ id: 123 }))
  return (
    <div>{dataArray.map(i => i)}</div>
  )
}
// 应用在async下
const APP = () => {
  const fetcher = async () => {
    const { dataArray, error } = await dispatchAsync(getUserInfo({id: 123}))
  }
  return (
    <div onClick={fetcher}>获取数据</div>
  )
}
```

## API 

### AsyncRequestProvider  | request_middleware
全局配置, `useRequest`和`dispatchAsync`需要一个请求器，需要在全局配置中传入。

提供`request_middleware`中间件在friday应用中通过中间件注入。
提供`AsyncRequestProvider`在任意react应用中使用

```js
import { axiosService, httpAxios, AsyncRequestProvider} from 'friday-async'

const axiosInstance = httpAxios({
    baseURL: 'http://10.2.32.178:3000/mock/40/friday',
  })

const Index =() => {
  return (
    <AsyncRequestProvider value = {{
      axiosInstance,
      fetcher: (params) => axiosInstance(params)
    }}>
      </APP>
    </AsyncRequestProvider>
  )
}

```



#### createGetApi| createPostApi
`createGetApi|createPostApi`接受一个axios配置作为参数
```javascript

const createGetApi: <Params = any, Data = any>(apiConfig: ApiConfig) => (params: Params) => Service<Params, Data>

export type ApiConfig<Params = any, Data = any> = AxiosRequestConfig & {
	url: string
	method?: Method
	params?: Params
	data?: Params
	_response?: Data
	[x: string]: any
}
```
`createGetApi | createPostApi`接收`Params`和`Data`作为入参和返回的数据推导对象，能在`useRequest`和`dispatchAsync`自动推导。

`createGetApi | createPostApi`返回一个包含axios配置函数，在使用时传入的参数(`params or data `)将和定义时的配置（`apiConfig`）进行合并一起推送给`useRequest`或`dispatchAsync`进行数据拉取。

在`useRequest`的场景下，`useRequest`会监测`params`参数的改变，`params`改变后将会重新进行拉取数据，并`update`react组件。  


`useRequest`通常作为在hooks场景下的请求器，而`dispatchAsync`在任何js场景下都可以使用，更多的时候，`useRequest`作为`get`请求器，`dispatchAsync`作为`post`请求器。

#### useRequest(service, config): BaseResult| PaginationResult| LoadMoreResult

`useRequest`使用于`React.FC`场景下，`useRequest`基于`swr`，所以它属于一个`get`请求器。 `useRequest`只接收createGetApi生成的api 生成的api。

`useRequest` 接收两个参数，

- `service`接收`createGetApi`生成的api，同时自动推导`api`配置中的`params`及`repsonsedata`
- `config` 继承了所有`swr`的配置项，并且定制了`antd`的一些配置

```javascript
interface ConfigInterface<Data = any, Error = any, Fn extends fetcherFn<Data> = fetcherFn<Data>> {
    // 错误重试时间间隔
    errorRetryInterval?: number;
    // 次数
    errorRetryCount?: number;
    // 超时
    loadingTimeout?: number;
    // 获取焦点触发时间间隔
    focusThrottleInterval?: number;
    // 删除缓存数据
    dedupingInterval?: number;
    // 更新缓存数据
    refreshInterval?: number;
    // 是否更新缓存fetcher
    refreshWhenHidden?: boolean;
    // 离线更新
    refreshWhenOffline?: boolean;
    // 页面激活重新拉数据
    revalidateOnFocus?: boolean;
    // 页面激活重新拉数据
    revalidateOnMount?: boolean;
    revalidateOnReconnect?: boolean;
    // 错误重试
    shouldRetryOnError?: boolean;
    // 自定义请求器，已提供全局中间件
    fetcher?: Fn;
    // suspense 
    suspense?: boolean;
    // 默认数据，无需使用
    initialData?: Data;
    // 网络是否在线
    isOnline?: () => boolean;
    // 窗口是否激活
    isDocumentVisible?: () => boolean;
    // 慢请求
    onLoadingSlow?: (key: string, config: ConfigInterface<Data, Error>) => void;
    // 请求成功callback
    onSuccess?: (data: Data, key: string, config: ConfigInterface<Data, Error>) => void;
    // 请求失败callback
    onError?: (err: Error, key: string, config: ConfigInterface<Data, Error>) => void;
    onErrorRetry?: (err: Error, key: string, config: ConfigInterface<Data, Error>, revalidate: revalidateType, revalidateOpts: RevalidateOptionInterface) => void;
    compare?: (a: Data | undefined, b: Data | undefined) => boolean;
    // 分页请求，多两个参数
    defaultPageSize?: number
    // 是否使用分页
    paginated?: boolean
    // 下拉加载更多，和paginated 自选一个，默认分页
    loadMore?: boolean
}

```

useRequest的返回值有三种

- 默认返回值 `BaseResult`
```javascript
export declare type responseInterface<Data, Error> = {
    data?: Data;
    error?: Error;
    revalidate: () => Promise<boolean>;
    mutate: (data?: Data | Promise<Data> | mutateCallback<Data>, shouldRevalidate?: boolean) => Promise<Data | undefined>;
    isValidating: boolean;
};

export interface BaseResult<Params = any, Data = any> extends responseInterface<Data> { 
    params: Params | undefined
    dataArray: Data[]
    dataJson: Data
    responseBlob: any
    responseArray: Response<Data[]>
    responseJson: Response<Data>
}
```

- 分页请求返回值。`PaginationResult`

```javascript
export interface PaginationResult<Params = any, Data = any> extends BaseResult<Params, Data> {
    params: PaginationParams<Params>
    pagination: PaginationConfig
    tableProps: {
        pagination: PaginationConfig
        loading: boolean
        onChange: (pagination: PaginationConfig) => void;
        dataSource: Data[]
        [key: string]: any;
    }
    noMore?: boolean;
    loadMore: () => any
    dataArray: Data[]
    dataJson: Data
    responseArray: PaginationResponse<Data[]>
    responseJson: PaginationResponse<Data>
}
// 分页请求的返回值，兼容了`Antd`的`Table`，在如下示例中，将展示如何使用
```
- 加载更多（分页）模式的返回值。LoadMoreResult
```javascript
export interface LoadMoreResult<Params = any, Data = any> extends BaseResult<Params, Data> {
    params: PaginationParams<Params>
    noMore?: boolean;
    onLoadMore: () => any
    dataArray: Data[]
    dataJson: Data
    // list 数据获取的数据汇总， dataArray为当前页数的数据
    list: Data[]
    responseArray: PaginationResponse<Data[]>
    responseJson: PaginationResponse<Data>
}
```

示例：

>  发起一个useRequest请求

```javascript
import { createGetApi, useRequest } from 'friday-async'

const getUserInfo = createGetApi<{id: number}, {id: number, name: string}>({url: '/userInfo'})

const response = useRequest(getUserInfo(params))

```

> 发起一个useRequest分页请求, 并使用antd table中

```javascript
import { createGetApi, useRequest } from 'friday-async'

import { Table } from 'Antd'

const getList = createGetApi<{id: number}, {id: number, name: string}[]>({url: '/list'})

const { pagination, tableProps } = useRequest(getList(params), {
    paginated: true
})

<Table 
    {...tableProps}
    // 或只使用分页
    pagination={pagination}
>

```

> 发起一个useRequest加载更多请求，加载更多一般适用于滚动数据展示

```javascript
import { createGetApi, useRequest } from 'friday-async'

import { Button } from 'Antd'

const getList = createGetApi<{id: number}, {id: number, name: string}[]>({url: '/list'})

const App = () => {
    const { list, onLoadMore } = useRequest(getList(params), {
        loadMore: true
    })
    return (
        <div>
            {list}
            <Button onClick={onLoadMore}>onLoadMore</Button>
        </div>
    )
}

```

### dispatchAsync(service): Promise<BaseResult>
`dispatchAsync`同时支持`get|post service`，返回`BaseResult`

> 使用dispatchAsync发起一个post/get请求

```javascript
import { createPostApi, dispatchAsync } from 'friday-async'

const deleteUser = createPostApi<{id: number}, {id: number, name: string}>({url: '/delete/user'})

const deleteController = async () => {
    const responst = await dispatchAsync(deleteUser({id: 2}))
}

```










