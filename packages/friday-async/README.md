

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

## Service 概念

`friday-async`提供了`createGetApi 、 createPostApi`两个`api`方便快速生成`api`模版, 

以下文档我们统一将`createGetApi 、 createPostApi`称为`service`，我们对`service`的定义做一个共识：

```js

export const createGetApi = <Params = any, Data = any>(
	apiConfig: ApiConfig
): HeadService<Params, Data> => {
	return (headParams: Params, otherSet = {}): LastService<Params, Data> => (lastParams = {} as Params) => {
		const nextParams = { ...headParams, ...lastParams }
		return {
			...apiConfig,
			params: nextParams,
			method: 'get',
			...otherSet
		}
	}
}

```
可以看到，`service`是一个柯里化函数，在进行首次配置后, 将返回一个`HeadService`。

`HeadService`接收两个参数，第一个参数，将成为`service`的请求参数，第二个函数`otherSet`作为扩展参数，方便扩展。

`HeadService`执行之后将会返回一个函数，我们称为`LastService`，同时`LastService`也能接收一个参数，并能和`HeadService`的参数进行合并。

通过对`service`的柯里化，后续在`useRequest`进行定制化的时候，我们可以随意选择在`HeadService`或者`LastService`阶段传入一些定制参数。

## fetcher 

上面我们讲到`Service`, 而`Service`只是一个配置器而已，我们需要一个`http`去协助`Service`发起请求。

`friday-async`提供了两个方法进行全局配置。

- `AsyncRequestProvider` 普通react应用

```js dark

import { httpAxios, AsyncRequestProvider } from 'friday-async'

const axiosInstance = httpAxios({
	baseURL: 'http://10.2.32.178:3000/mock/40/friday',
})

<AsyncRequestProvider value={{ axiosInstance }}>
  <App />
</AsyncRequestProvider>
```
- `request_middleware` `friday`应用可以通过中间件的方法配置。

```js dark

import { httpAxios, request_middleware } from 'friday-async'

export const axiosInstance = httpAxios({
	baseURL: publicUrl.baseUrl,
})

const axios_middleware = request_middleware({axiosInstance})
```

`fetcher`只是作为一个请求器，而我们对请求的结果，请求的场景常常需要一些特殊的制定，比如在更新参数的时候自动触发重新请求，页面获取焦点后重新请求，等等。

`useRequest` 和 `dispatchAsync`则为此而生。

# API 

## `createGetApi/createPostApi<Params, Data>({url: ''}: AxiosConfig): HeadService`

`createGetApi`和`createPostApi`相同，都需要传入`axiosconfig`生成一个`api`,返回一个`HeadService`。

`Params`和`Data`分别为该api的参数和返回值类型，在`dispatchAsync`和`useRequest`会自动推导`

```js dark
// 生成一个get api
const getUserInfo = createGetApi<{id: number}, {id: number, name: string}>({url: '/userInfo'})
// post api
const deleteUser = createPostApi<{id: number}, {id: number, name: string}>({url: '/delete/user'})
```

## useRequest<Params, Data>(HeadService | LastService, config): BaseResult<Params, Data>

`useRequest`接收`HeadService`或者`LastService`。 

只有在手动模式下`（config.manual == true ）`，`useRequest`才接收一个`HeadService`。

除此之外全部接收`LastService`, 在非手动下`useRequest`将会对`LastService`进行依赖检查，当`LastService`改变时，`useRequest`会重新进行请求。

不同的`config`将会有不同的返回，在`typescirpt`应用下，`useRequest`会自动推导出不同的返回值。

```js dark
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
	// 是否使用分页， 
	paginated?: boolean
	// 下拉加载更多，和paginated 自选一个，默认分页
	loadMore?: boolean
	// 手动触发, 开启手动触发后，useRequest不会自动请求，需要通过run进行调用
	manual?: boolean
}
```

以上是`config`完整的配置表，下面我们对关键配置进行讲解.
```js dark 

// default config : BaseResult

config.paginated === true  // PaginationResult

config.loadMore === true  // LoadMoreResult

config.manual === true  // ManualResult
 
```
`paginated、loadMore、manual`配置互斥，代表某一种请求场景，下面我们会用示例来展示不同特性。


## dispatchAsync<Parmas, Data>(service): BaseResult<Params, Data>

在特殊场景上（如非react组件中）我们需要`dispatchAsync`来更简单的完成一些异步操作。

`dispatchAsync`返回一个`promise`。


# Exampple


### 发起一个普通useRequest请求

```js dark

import { createGetApi, useRequest } from 'friday-async'

const getUserInfo = createGetApi<{id: number}, {id: number, name: string}>({url: '/userInfo'})

const response = useRequest(getUserInfo(params))

```
此时`useRequest`返回默认的返回值`BaseResult`

```js dark
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

### 发起一个useRequest分页请求, 并使用antd table中

```js dark
import { createGetApi, useRequest } from 'friday-async'

import { Table } from 'Antd'

const getList = createGetApi<{id: number}, {id: number, name: string}[]>({url: '/list'})

const { pagination, tableProps } = useRequest(getList(params), {
	paginated: true
})

<Table 
	{...tableProps}
	或者只使用分页
	pagination={pagination}
>
```
我们可以看到，`config`设置了 `paginated`, 则返回值为`PaginationResult`

```js dark
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
```

#### 发起一个useRequest加载更多请求，加载更多一般适用于滚动数据展示

```js dark
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
`config`设置了 `loadMore`之后,返回值为`LoadMoreResult`:

```js dark
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

#### 发起一个手动请求的useRequest 

```js dark
import { createGetApi, useRequest } from 'friday-async'

import { Button } from 'Antd'

const getList = createGetApi<{id: number}, {id: number, name: string}[]>({url: '/list'})

const App = () => {

	const { run } = useRequest(getList, {
		manual: true
	})

	return (
		<div>
			<Button onClick={() => run({id: 1})}>fetch data</Button>
		</div>
	)
}
```
`config`设置了 `manual`之后,返回值为`ManualResult`:

```js dark

export interface ManualResult<Params = any, Data = any> extends BaseResult<Params, Data> {
	run: (params: Params) => void
}
```
⚠️： 手动模式不需要监控动态依赖，所以我们只需要传入一个`HeadService`，在通过`run`方法进行调用，`run`方法将为推导你需要的参数。


#### 使用`dispatchAsync`发起一个请求

```js dark
import { createPostApi, dispatchAsync } from 'friday-async'

const deleteUser = createPostApi<{id: number}, {id: number, name: string}>({url: '/delete/user'})

const deleteController = async () => {
	const responst = await dispatchAsync(deleteUser({id: 2}))
}
```

tips: 

- 当Api不需要参数时，传入一个`void`即可： `createPostApi<void>()`
