import { isArray } from 'friday-helpers'
import { ApiConfig, HeadService, LastService } from './useRequest/type'


const mergeParasm = <Params>(headParams: Params, lastParams) => {
	if (isArray(headParams)) {
		return headParams.map(h => ({...h, ...lastParams}))
	}

	return  { ...headParams, ...lastParams }
}

export const createGetApi = <Params = any, Data = any>(
	apiConfig: ApiConfig
): HeadService<Params, Data> => {
	return (headParams: Params, otherSet = {}): LastService<Params, Data> => (lastParams = {} as Params) => {

		const nextParams = { ...headParams, ...lastParams }

		return {
			...apiConfig,
			params: nextParams,
			method: 'get',
			...otherSet
		}
	}
}

export const createPostApi = <Params = any, Data = any>(
	apiConfig: ApiConfig
): HeadService<Params, Data> => {
	return (headParams: Params, otherSet = {}): LastService<Params, Data> => (lastParams = {} as Params) => {

		const nextData = mergeParasm<Params>(headParams, lastParams) as Params

		return {
			...apiConfig,
			data: nextData,
			method: 'post',
			...otherSet
		}
	}
}
