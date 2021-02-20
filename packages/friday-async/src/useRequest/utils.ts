
import warning from 'warning'
import invariant from 'invariant'
import { isArray, isObject, isEqual, isFunction } from 'friday-helpers'
import { ServiceCombin, ServiceResult, Response, ApiConfig } from './type'

export const genarateServiceConfig = <Params, Data>(
	service: ServiceCombin<Params, Data>
): ServiceResult<Params, Data> => {
	if (isObject(service)) {
		return service as ApiConfig<Params, Data>
	}
	if (isFunction(service)) {
		return (service as Function)()
	}
	
	return null
}

export const contrastServiceParams = (preService, curService) => {
	const preServiceParams = getServiceParams(preService)

	const curServiceParams = getServiceParams(curService)

	return isEqual(preServiceParams, curServiceParams)
}

export const getServiceParams = <Params, Data>(service: ServiceCombin<Params, Data>) => {

	const serviceResult = genarateServiceConfig(service)

	if (serviceResult == null ) throw 'service is null'

	const paramsKey = serviceResult.method == 'get' ? 'params' : 'data'

	return serviceResult[paramsKey]
}

export const mergeServiceParams = <Params, Data>(
	preServiceConfig: ServiceResult<Params, Data>, 
	mergeParams: object
): ServiceResult<Params, Data> => {
	if (!mergeParams) return preServiceConfig

	if (!preServiceConfig || !preServiceConfig.method) {
		invariant(false, 'service 不合法')
	}

	const method = preServiceConfig.method
	
	const payloadKey = method == 'get' ? 'params' : 'data'

	return {
		...preServiceConfig as ApiConfig<Params, Data>,
		[payloadKey]: {
			...preServiceConfig![payloadKey],
			...mergeParams
		}
	}
}

const validator = <T>(axiosResponse: Response<T>, rule, defaultVal) => {
	if (Object.prototype.toString.call(axiosResponse?.data) !== `[object ${rule}]`) {
		return { data: defaultVal as any }
	}
	// istanbul ignore next
	return axiosResponse
}

export const getDisasterRecoveryData = <Data>(axiosResponse: Response<Data> | undefined, isBlob = false) => {

	if (
		axiosResponse !== undefined &&
		/* istanbul ignore next */
		(!isArray(axiosResponse?.data) && !isObject(axiosResponse?.data)) && 
		!isBlob
	) {
		warning(false, '接口返回格式错误, data没返回，或者不是array | object')
	}

	const responseJson = validator(axiosResponse!, 'Object', {}) as Response<Data>
	const responseArray = validator(axiosResponse!, 'Array', []) as Response<Data[]>

	return {
		responseBlob: isBlob ? axiosResponse: null,
		responseArray,
		responseJson,
		dataArray: responseArray.data,
		dataJson: responseJson.data,
	}
}


export declare type fetcherFn<Data> = ((...args: any) => Data | Promise<Data>) | null;

export const fetcherWarpper = (fetcher) => {

	if (!fetcher) return undefined

	return <Data>(axiosConfigString): fetcherFn<Data> => {
		let axiosConfig
		try {
			axiosConfig = JSON.parse(axiosConfigString)

		} catch (error) {
			axiosConfig = new Error(error)
		}

		if (axiosConfig instanceof Error) {
			invariant(false, '[fetcher parse] axiosConfig parse error')
		}
		return fetcher(axiosConfig) as fetcherFn<Data>

	}
}	