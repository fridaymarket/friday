import React from 'react'
import invariant from 'invariant'
import useSWR from 'swr'
import { Provider } from './context'
import { fetcherWarpper } from './fetcherWarpper'
import { genarateServiceConfig, getDisasterRecoveryData } from './utils'
import {
	ConfigInterface,
	PaginationConfigInterface,
	BaseResult,
	Response,
	ServiceCombin
} from './type'

const DEFAULT_CONFIG = {
	manual: false,
	pagination: false,
	shouldRetryOnError: false,
	revalidateOnFocus: false
}

function useAsync<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config: ConfigInterface<Data>
): BaseResult<Params, Data>
function useAsync<Params = any, Data = any>(
	service: ServiceCombin<Params, Data>,
	config: PaginationConfigInterface<Data>
): BaseResult<Params, Data>
function useAsync<Params = any, Data = any>(service: ServiceCombin<Params, Data>, config) {
	const globalConfig = React.useContext(Provider)

	const requestConfig = Object.assign({}, DEFAULT_CONFIG, globalConfig as any, config || {})
	//传入参数fetcher 保证与swr 一致
	if (requestConfig.fetcher) {
		requestConfig['fetcher'] = fetcherWarpper(requestConfig.fetcher)
	}

	const configRef = React.useRef(requestConfig)

	configRef.current = requestConfig

	const serviceConfig = genarateServiceConfig(service)

	invariant(
		configRef.current.biReuqest || !(serviceConfig?.method === 'post'),
		'[service method] service method must be get'
	)

	const serviceRef = React.useRef(serviceConfig)

	serviceRef.current = serviceConfig

	const serializeKey = React.useMemo(() => {
		if (!serviceRef.current) return null

		try {
			return JSON.stringify(serviceRef.current)
		} catch (error) {
			return new Error(error)
		}
	}, [serviceRef.current])

	if (serializeKey instanceof Error) {
		invariant(false, '[serializeKey] service must be object')
	}

	const response = useSWR<Response<Data>>(serializeKey, configRef.current)

	const getParams = React.useMemo(() => {
		if (!serviceRef.current) return undefined

		return (serviceRef.current?.params || serviceRef.current?.data || {}) as Params
	}, [serviceRef.current])

	const disasterRecoveryData = React.useMemo(() => {
		return getDisasterRecoveryData<Data>(response?.data)
	}, [response.data])

	return {
		...response,
		...disasterRecoveryData,
		params: getParams
	}
}

export default useAsync
