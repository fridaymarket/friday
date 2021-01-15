import React from 'react'
import { SWRConfig } from 'swr'
import { Provider } from './useRequest/context'
import { axiosService } from './axios'

const AsyncRequestProvider = (props) => {
	const { value, children } = props

	const { axiosInstance } = value

	axiosService.setAixosInstance(axiosInstance)

	return (
		<Provider.Provider value={value}>
			<SWRConfig value={value}>{children}</SWRConfig>
		</Provider.Provider>
	)
}

export default AsyncRequestProvider
