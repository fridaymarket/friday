import React from 'react'
import { SWRConfig } from 'swr'
import { axiosService } from './axios'
import { AsyncConfigContext, RequestMiddleware } from './useRequest/context'

const request_middleware = (requestConfigs: RequestMiddleware) => {

	const { axiosInstance } = requestConfigs

	axiosService.setAixosInstance(axiosInstance)

	const swrConfig = {
		...requestConfigs,
		fetcher: (params) => axiosInstance(params)
	}
	
	return ({ App, configuration }) => {
		return {
			App(props) {
				return (
					<AsyncConfigContext.Provider value={requestConfigs}>
						<SWRConfig value={swrConfig}>
							<App {...props} />
						</SWRConfig>
					</AsyncConfigContext.Provider>
				)
			},
			configuration
		}
	}
}

export default request_middleware