
import React from 'react'
import usePagination from './usePagination'

import {
	ServiceCombin,
	LoadMoreConfigInterface,
	LoadMoreResult,
} from './type'

function useLoadMore<Params, Data>(
	service: ServiceCombin<Params, Data>,
	config: LoadMoreConfigInterface<Params, Data>
): LoadMoreResult<Params, Data> {

	const { dataArray, params,  ...response } = usePagination(service, config)

	const [list, setList] = React.useState<Data[]>([])

	React.useEffect(() => {
		if (params?.page === 1) {
			setList(dataArray)
		} else {
			setList([...list, ...dataArray])
		}
	}, [dataArray])

	return {
		list,
		dataArray,
		params,
		...response
	} as LoadMoreResult<Params, Data>
}


export default useLoadMore

