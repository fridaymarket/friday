import warning from 'warning'
import { isArray, isObject, isEqual } from 'friday-helpers'
import { ServiceCombin, ServiceCombinResult, Response, ApiConfig } from './type'

export const genarateServiceConfig = <Params, Data>(
	service: ServiceCombin<Params, Data>
): ServiceCombinResult<Params, Data> => {
	if (typeof service === 'object') {
		return service
	}
	if (typeof service === 'function') {
		return service()
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

	if (serviceResult == null) throw 'service is null'

	const paramsKey = serviceResult.method == 'get' ? 'params' : 'data'

	return serviceResult[paramsKey]
}

export const mergeServiceParams = <Params, Data>(
	preServiceConfig: ServiceCombinResult<Params, Data>,
	mergeParams: object
): ServiceCombinResult<Params, Data> => {
	if (!mergeParams) return preServiceConfig

	const method = preServiceConfig?.method
	const payloadKey = method == 'get' ? 'params' : 'data'

	return {
		...(preServiceConfig as ApiConfig<Params, Data>),
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

export const getDisasterRecoveryData = <Data>(
	axiosResponse: Response<Data> | undefined,
	isBlob = false
) => {
	if (
		axiosResponse !== undefined &&
		!isArray(axiosResponse?.data) &&
		!isObject(axiosResponse?.data) &&
		!isBlob
	) {
		warning(false, '接口返回格式错误, data没返回，或者不是array | object')
	}

	const responseJson = validator(axiosResponse!, 'Object', {}) as Response<Data>
	const responseArray = validator(axiosResponse!, 'Array', []) as Response<Data[]>

	return {
		responseBlob: isBlob ? axiosResponse : null,
		responseArray,
		responseJson,
		dataArray: responseArray.data,
		dataJson: responseJson.data
	}
}
