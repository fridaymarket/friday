import { ApiConfig, HeadService, LastService } from './useRequest/type'

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

		const nextData = { ...headParams, ...lastParams }
		
		return {
			...apiConfig,
			data: nextData,
			method: 'post',
			...otherSet
		}
	}
}
	