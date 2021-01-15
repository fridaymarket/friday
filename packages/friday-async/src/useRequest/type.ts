import {
	ConfigInterface as swrConfigInterface,
	responseInterface as swrResponseInterface
} from 'swr'

import { AxiosRequestConfig, Method, AxiosResponse } from 'axios'

export type { AxiosResponse }

export type swrConfig<Data> = swrConfigInterface<Response<Data>>

export interface ConfigInterface<Data = any> extends swrConfig<Data> {
	// defaultParams?: object
	// 给bi开的后门，让bi 的get api可以使用userequest
	biReuqest?: boolean
	formatResult?: (res) => any
}

export interface PaginationConfigInterface<Data = any> extends ConfigInterface<Data> {
	defaultPageSize?: number
	paginated?: boolean
}

export interface LoadMoreConfigInterface<Data = any> extends ConfigInterface<Data> {
	defaultPageSize?: number
	loadMore?: boolean
}

export type PaginationParams<Params> = Params & {
	page: number
	pageSize: number
}

export type swrResponse<Data> = swrResponseInterface<Response<Data>, any>

export interface BaseResult<Params = any, Data = any> extends swrResponse<Data> {
	params: Params | undefined
	dataArray: Data[]
	dataJson: Data
	responseBlob: any
	responseArray: Response<Data[]>
	responseJson: Response<Data>
}

export interface PaginationResult<Params = any, Data = any> extends BaseResult<Params, Data> {
	params: PaginationParams<Params>
	pagination: PaginationConfig
	tableProps: {
		pagination: PaginationConfig
		loading: boolean
		onChange: (pagination: PaginationConfig) => void
		dataSource: Data[]
		[key: string]: any
	}
	noMore?: boolean
	onLoadMore: () => any
	dataArray: Data[]
	dataJson: Data
	responseArray: PaginationResponse<Data[]>
	responseJson: PaginationResponse<Data>
}

export interface LoadMoreResult<Params = any, Data = any> extends BaseResult<Params, Data> {
	params: PaginationParams<Params>
	noMore?: boolean
	onLoadMore: () => any
	dataArray: Data[]
	dataJson: Data
	list: Data[]
	responseArray: PaginationResponse<Data[]>
	responseJson: PaginationResponse<Data>
}

export declare interface Response<Data = any> {
	code: number
	message: string
	data: Data
}

export declare interface PaginationResponse<Data = any> extends Response<Data> {
	totalPage?: number
	pageSize?: number
	page?: number
	total?: number
}

export interface PaginationConfig {
	total?: number
	defaultCurrent?: number
	disabled?: boolean
	current?: number
	defaultPageSize?: number
	pageSize?: number
	onChange?: (page: number, pageSize?: number) => void
	hideOnSinglePage?: boolean
	showSizeChanger?: boolean
	pageSizeOptions?: string[]
	onShowSizeChange?: (current: number, size: number) => void
	showQuickJumper?:
		| boolean
		| {
				goButton?: React.ReactNode
		  }
	showTotal?: (total: number, range: [number, number]) => React.ReactNode
	simple?: boolean
	style?: React.CSSProperties
	locale?: Object
	className?: string
	prefixCls?: string
	selectPrefixCls?: string
	itemRender?: (
		page: number,
		type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
		originalElement: React.ReactElement<HTMLElement>
	) => React.ReactNode
	role?: string
	showLessItems?: boolean
	[key: string]: any
}

export type ApiConfig<Params = any, Data = any> = AxiosRequestConfig & {
	url: string
	method?: Method
	params?: Params
	data?: Params
	_response?: Data
	[x: string]: any
}

export type Service<Params = any, Data = any> = (_params?: any) => ApiConfig<Params, Data>

export type ServiceCombin<Params = any, Data = any> =
	| ApiConfig<Params, Data>
	| Service<Params, Data>
	| null

export type ServiceCombinResult<Params = any, Data = any> = ApiConfig<Params, Data> | null
