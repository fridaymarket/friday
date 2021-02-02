import { ApiConfig, Service } from './useRequest/type'

export const createGetApi = <Params = any, Data = any>(apiConfig: ApiConfig) => {
	return (params: Params): Service<Params, Data> => (_params = {}) => {
		const nextParams = { ...params, ..._params }

		return {
			...apiConfig,
			params: nextParams,
			method: 'get'
		}
	}
}

export const createPostApi = <Params = any, Data = any>(apiConfig: ApiConfig) => {
	return (data: Params): Service<Params, Data> => {
		return () => ({
			...apiConfig,
			data,
			method: 'post'
		})
	}
}

export const createGet = createGetApi
export const createPost = createPostApi
