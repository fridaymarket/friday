
import React from 'react'
import invariant from 'invariant'
import useSWR from 'swr'
import { AsyncConfigContext } from './context'
import {
	getParams,
	fetcherWarpper,
	genarateServiceConfig,
	getDisasterRecoveryData,
} from './utils'
import {
	BaseConfigInterface,
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
	config: BaseConfigInterface<Params, Data>
): BaseResult<Params, Data>;
function useAsync<Params = any, Data = any>(service: ServiceCombin<Params, Data>, config) {

	const serviceConfig = genarateServiceConfig(service)

	const serviceRef = React.useRef(serviceConfig)

	serviceRef.current = serviceConfig

	const globalConfig = React.useContext(AsyncConfigContext)

	const requestConfig = Object.assign(
		{},
		DEFAULT_CONFIG,
		globalConfig as any,
		config || {}
	)

	invariant(
		requestConfig.fetcher,
		'[fetcher] fetcher is a required configuration item, can be passed in through request_middleware or AsyncRequestProvider'
	)

	const overRewriteConfig = {
		...requestConfig,
		fetcher: fetcherWarpper(requestConfig.fetcher),
		onSuccess: (data, key, config) => {
			if (requestConfig?.onSuccess) {
				const disasterRecoveryData = getDisasterRecoveryData<Data>(data)
				requestConfig.onSuccess({
					key,
					data,
					config,
					params: getParams(serviceRef.current),
					...disasterRecoveryData
				})
			}
		}
	}

	const configRef = React.useRef(overRewriteConfig)

	configRef.current = overRewriteConfig

	const serializeKey = React.useMemo(() => {
		if (!serviceRef.current) return null
		try {
			return JSON.stringify(serviceRef.current)
		} catch (error) {
			return new Error(error)
		}
	}, [
		serviceRef.current,
		configRef.current.isPaused
	])

	if (serializeKey instanceof Error) {
		invariant(false, '[serializeKey] service must be object')
	}

	const response = useSWR<Response<Data>>(serializeKey, configRef.current)

	const disasterRecoveryData = React.useMemo(() => {
		return getDisasterRecoveryData<Data>(response?.data)
	 }, [response.data])

	return {
		...response,
		...disasterRecoveryData,
		params: getParams(serviceRef.current),
	}
}

export default useAsync
