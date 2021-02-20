
import React from 'react'
import useAsync from './useAsync'
import { genarateServiceConfig, mergeServiceParams, contrastServiceParams } from './utils'
import { 
	ServiceCombin, 
	PaginationConfigInterface, 
	PaginationResult, 
	PaginationParams, 
	PaginationResponse 
} from './type'

const PAGINATION_LIST = ['10', '20', '50', '100', '200', '500']

function usePagination<Params, Data>(
	service: ServiceCombin<Params, Data>,
	config: PaginationConfigInterface<Data>
): PaginationResult<Params, Data> {

	const { defaultPageSize = 10 } = config

	const rerender = React.useState<any>(null)[1]

	const paginationRef = React.useRef({
		page: 1,
		pageSize: defaultPageSize,
	})
	// xn
	const serviceRef = React.useRef(service)

	// 对比前后service参数是否相同
	const isEqualParmas = contrastServiceParams(serviceRef.current, service)

	serviceRef.current = service

	// 参数改变，页数要重置
	if (!isEqualParmas) {
		paginationRef.current.page = 1
	}
	// get service object
	const serviceConfig = genarateServiceConfig(serviceRef.current)
	// merger pagination to service params
	const nextServiceConfig = mergeServiceParams(serviceConfig, paginationRef.current)
	
	type _PaginationParams = PaginationParams<Params>
	
	const { responseArray, ...response } = useAsync<_PaginationParams, Data>(nextServiceConfig, config)

	const onLoadMore = () => {
		if (!service || !response.params) return 
		paginationRef.current.page++
		rerender({})
	}

	const { tableProps, pagination } = React.useMemo(() => {
		const pagination = {
			current: paginationRef.current.page,
			pageSizeOptions: PAGINATION_LIST,
			showSizeChanger: true,
			pageSize: paginationRef.current.pageSize,
			onChange: (page) => {
				paginationRef.current.page = page
				rerender({})
			},
			total: (responseArray as PaginationResponse<Data[]>).total || 0,
			onShowSizeChange(current, pageSize) {
				paginationRef.current.pageSize = pageSize
			}
		}
		return {
			pagination,
			tableProps : {
				pagination,
				loading: response.isValidating,
				dataSource: response.dataArray
			}
		}
	}, [
		(responseArray as PaginationResponse<Data[]>).total, 
		paginationRef.current, 
		rerender,
		response.isValidating,
		response.dataArray
	])

	return {
		tableProps,
		onLoadMore,
		pagination,
		responseArray,
		...response
	} as PaginationResult<Params, Data>
}


export default usePagination

