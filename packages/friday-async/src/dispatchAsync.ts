
import invariant from 'invariant'
import { axiosService } from './axios'
import { isFunction, isArray, isObject } from 'friday-helpers'

import { BaseResult, LastService } from './useRequest/type'
import { getDisasterRecoveryData } from './useRequest/utils'

export interface DispatchAsyncResult<Params, Data> extends BaseResult<Params, Data> {
	error: any
}

const responseSchemaValidate = (response, isBlob) => {
	if (!response) {
		throw Error('[dispatchAsync response error] response undefined')
	}
	// istanbul ignore next
	const data = response?.data

	if (!isArray(data) && !isObject(data) && !isBlob) {
		throw Error('[dispatchAsync response error]  data must be array | object')
	}

	return response
}

export const dispatchAsync = async <Params = any, Data = any>(
	service: LastService<Params, Data>
): Promise<DispatchAsyncResult<Params, Data>> => {

	const axiosInstance = axiosService.getAixosInstance()

	invariant(axiosInstance, '[dispatchAsync] axiosInstance not found')

	invariant(
		(isObject(service) || isFunction(service)),
		'[dispatchAsync]  service not found, service must be object or function'
	)

	let axiosConfig

	if (isObject(service)) {
		axiosConfig = service
	}

	if (isFunction(service)) {
		axiosConfig = service()
	}

	const isBlob = axiosConfig?.responseType === 'blob'

	return axiosInstance(axiosConfig)
		.then((result) => {
			return responseSchemaValidate(result, isBlob)
		})
		.then((result) => {
			
			// istanbul ignore next
			const _data = getDisasterRecoveryData<Data>(result, isBlob)

			return { ...result, ..._data, error: null }
		})
		.catch((error) => {
			const _data = getDisasterRecoveryData<Data>({} as any, isBlob)
			return { error, ..._data }
		})
}