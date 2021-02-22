import React from 'react'
import { SWRConfig } from 'swr'
import { AsyncConfigContext } from './useRequest/context'
import { axiosService } from './axios'

const AsyncRequestProvider = (props) => {
	const { value, children }  = props

	const { axiosInstance } = value

	axiosService.setAixosInstance(axiosInstance)

	const swrConfig = {
		...value,
		fetcher: (params) => axiosInstance(params)
	}

	return (
		<AsyncConfigContext.Provider value={swrConfig}>
			<SWRConfig value={swrConfig}>
				{children}
			</SWRConfig>
		</AsyncConfigContext.Provider>
	)
}

export default AsyncRequestProvider
