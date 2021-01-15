import React from 'react'
import invariant from 'invariant'
import useAsync from './useAsync'
import usePagination from './usePagination'
import useLoadMore from './useLoadMore'
import {
	ServiceCombin,
	ConfigInterface,
	PaginationConfigInterface,
	LoadMoreConfigInterface,
	BaseResult,
	PaginationResult,
	LoadMoreResult
} from './type'

function useRequest<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config?: ConfigInterface<Data>
): BaseResult<Params, Data>
function useRequest<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config?: LoadMoreConfigInterface<Data>
): LoadMoreResult<Params, Data>
function useRequest<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config?: PaginationConfigInterface<Data>
): PaginationResult<Params, Data>
function useRequest<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config: any = {}
) {
	const { paginated, loadMore } = config

	const paginatedRef = React.useRef(paginated)

	const loadMoreRef = React.useRef(loadMore)

	if (paginatedRef.current !== paginated || loadMoreRef.current !== loadMore) {
		invariant(false, 'You should not modify the paginated or loadMore of options')
	}

	if (paginated && loadMore) {
		invariant(false, 'paginated and loadmore are mutually exclusive, only one can be selected')
	}

	paginatedRef.current = paginated

	loadMoreRef.current = loadMore

	if (paginated) {
		return usePagination(service, config)
	}

	if (loadMore) {
		return useLoadMore(service, config)
	}

	return useAsync(service, config)
}

export default useRequest
