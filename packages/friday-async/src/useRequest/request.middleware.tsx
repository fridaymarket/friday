import React from 'react'
import { SWRConfig } from 'swr'
import { Provider } from './context'
import { ConfigInterface } from './type'
import { axiosService } from '../axios'

// test
const request_middleware = (axiosInstance, requestConfigs: ConfigInterface) => {
	axiosService.setAixosInstance(axiosInstance)

	const useRequestConfigs = {
		axiosInstance,
		...requestConfigs
	}

	return ({ App, configuration }) => {
		return {
			App(props) {
				return (
					<Provider.Provider value={useRequestConfigs}>
						<SWRConfig value={useRequestConfigs as any}>
							<App {...props} />
						</SWRConfig>
					</Provider.Provider>
				)
			},
			configuration
		}
	}
}

export default request_middleware
