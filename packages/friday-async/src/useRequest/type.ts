
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
	// 支持手动之后， biReuqest只留着做兼容旧版本
	biReuqest?: boolean
	formatResult?: (res) => any
}

type OmitIsPaused<Data> = Omit<ConfigInterface<Data>, 'isPaused'>

export interface ManualConfigInterface<Data = any> extends OmitIsPaused<Data> {
	manual: boolean
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

export interface ManualResult<Params = any, Data = any> extends BaseResult<Params, Data> {
	run: (params: Params) => void
}

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
	onLoadMore: () => any
	dataArray: Data[]
	dataJson: Data
	responseArray: PaginationResponse<Data[]>
	responseJson: PaginationResponse<Data>
}

export interface LoadMoreResult<Params = any, Data = any> extends BaseResult<Params, Data> {
	params: PaginationParams<Params>
	noMore?: boolean;
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
	total?: number;
	defaultCurrent?: number;
	disabled?: boolean;
	current?: number;
	defaultPageSize?: number;
	pageSize?: number;
	onChange?: (page: number, pageSize?: number) => void;
	hideOnSinglePage?: boolean;
	showSizeChanger?: boolean;
	pageSizeOptions?: string[];
	onShowSizeChange?: (current: number, size: number) => void;
	showQuickJumper?: boolean | {
		goButton?: React.ReactNode;
	};
	showTotal?: (total: number, range: [number, number]) => React.ReactNode;
	simple?: boolean;
	style?: React.CSSProperties;
	locale?: Object;
	className?: string;
	prefixCls?: string;
	selectPrefixCls?: string;
	itemRender?: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', originalElement: React.ReactElement<HTMLElement>) => React.ReactNode;
	role?: string;
	showLessItems?: boolean;
	[key: string]: any;
}


export type ApiConfig<Params = any, Data = any> = AxiosRequestConfig & {
	url: string
	method?: Method
	params?: Params
	data?: Params
	_response?: Data
	[x: string]: any
}

/**
 * 设计两层service的原因在于，两层扩展更加灵活。
 * 两层service的params在最后执行的时候将会被merge到一起，所以在扩展模块中（如分页），第二层常常被用来传入一些逻辑参数。
 */
// 首层service
export type HeadService<Params = any, Data = any> = (headParams: Params, otherSet?: object) => LastService<Params, Data>
// 第二层service
export type LastService<Params = any, Data = any> = (lastParams?: Params) => ApiConfig<Params, Data>
// service，useRequest 可以接收ServiceCombin中的任何一个条件去请求数据。
// LastService是一个function，在请求的时候useAsync会取出它的配置
// ApiConfig 是个对象，useAsync会直接使用它
// null 会被useAsync忽略，不请求
export type ServiceCombin<Params = any, Data = any> = LastService<Params, Data> | ApiConfig<Params, Data> | null
// 手动请求的service, 手动请求选择传入一个HeadService
// 传入HeadService（例： service）表示这个service等待被执行，并不是不需要参数
// 而传入LastService（例：service()），说明这个api不需要参数。
export type ManualService<Params = any, Data = any> = HeadService<Params, Data> | ServiceCombin<Params, Data>

export type ServiceResult<Params = any, Data = any> = ApiConfig<Params, Data> | null

