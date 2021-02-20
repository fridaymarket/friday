import React from 'react'
import invariant from 'invariant'
import useAsync from './useAsync'
import usePagination from './usePagination'
import useLoadMore from './useLoadMore'
import useManalRequest from './useManalAsync'
import { 
	ServiceCombin,
	ManualService,
	ConfigInterface,
	ManualConfigInterface,
	PaginationConfigInterface, 
	LoadMoreConfigInterface,
	BaseResult,
	ManualResult,
	PaginationResult,
	LoadMoreResult
} from './type'

function useRequest<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config?: LoadMoreConfigInterface<Data>
): LoadMoreResult<Params, Data>;

function useRequest<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config?: PaginationConfigInterface<Data>
): PaginationResult<Params, Data>;

function useRequest<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config?: ConfigInterface<Data>
): BaseResult<Params, Data> 

function useRequest<Params = any, Data = any>(
	service: ManualService<Params, Data>,
	config: ManualConfigInterface<Data>
): ManualResult<Params, Data> 

function useRequest<Params = any, Data = any>(
	service: any,
	config: any = {}
) {
	const { paginated, loadMore, manual } = config

	const paginatedRef = React.useRef(paginated)

	const loadMoreRef = React.useRef(loadMore)

	if (paginatedRef.current !== paginated || loadMoreRef.current !== loadMore) {
		invariant(false, 'You should not modify the paginated or loadMore of options')
	}

	if (paginated && loadMore && manual) {
		invariant(false, 'paginated 、 manual and loadmore  are mutually exclusive, only one can be selected')
	}

	paginatedRef.current = paginated

	loadMoreRef.current = loadMore

	if (paginated) {
		return usePagination<Params, Data>(service, config)
	} 

	if (loadMore) {
		return useLoadMore<Params, Data>(service, config)
	}
	// 手动触发， 暂时不支持分页。有需求在扩展
	if (manual) {
		return useManalRequest<Params, Data>(service, config)
	}

	return useAsync<Params, Data>(service, config)
}

export default useRequest