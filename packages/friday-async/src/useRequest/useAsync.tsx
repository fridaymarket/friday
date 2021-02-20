
import React from 'react'
import invariant from 'invariant'
import useSWR from 'swr'
import { AsyncConfigContext } from './context'
import { 
	fetcherWarpper,
	genarateServiceConfig,
	getDisasterRecoveryData,
} from './utils'
import { 
	ConfigInterface,
	BaseResult,
	Response,
	ServiceCombin
} from './type'

const DEFAULT_CONFIG = {
	shouldRetryOnError: false,
	revalidateOnFocus: false
}

function useAsync<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config: ConfigInterface<Data>
): BaseResult<Params, Data>;
function useAsync<Params = any, Data = any>(service: ServiceCombin<Params, Data>, config) {

	const globalConfig = React.useContext(AsyncConfigContext)

	const requestConfig = Object.assign(
		{}, 
		DEFAULT_CONFIG, 
		globalConfig as any,
		config || {}
	)

	//传入参数fetcher 保证与swr 一致
	if (requestConfig.fetcher) {
		requestConfig['fetcher'] = fetcherWarpper(requestConfig.fetcher)
	}

	const configRef = React.useRef(requestConfig)

	configRef.current = requestConfig

	const serviceConfig = genarateServiceConfig(service)

	const serviceRef = React.useRef(serviceConfig)

	serviceRef.current = serviceConfig

	const isPaused = configRef.current.isPaused

	const serializeKey = React.useMemo(() => {
		
		if (!serviceRef.current) return null

		try {
			return JSON.stringify(serviceRef.current)
		} catch (error) {
			return new Error(error)
		}
	}, [ serviceRef.current, isPaused ])

	if (serializeKey instanceof Error) {
		invariant(false, '[serializeKey] service must be object')
	}
	
	const response = useSWR<Response<Data>>(serializeKey, configRef.current)

	const getParams = React.useMemo(() => {

		if (!serviceRef.current) return undefined

		return (
			serviceRef.current?.params || 
			serviceRef.current?.data || 
			{}
		) as Params

	}, [serviceRef.current])

	const disasterRecoveryData = React.useMemo(() => {
		return getDisasterRecoveryData<Data>(response?.data)
	 }, [response.data])
	
	return {
		...response,
		...disasterRecoveryData,
		params: getParams,
	}
}

export default useAsync 