import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// import warning from 'warning'

// const isDev = process.env.NODE_ENV === 'development'

export interface AxiosHooks {
	requestSuccessHook?: (config: AxiosRequestConfig) => AxiosRequestConfig
	requestErrorHooks?: (error: any) => Promise<any>
	responseSuccessHooks?: (response: AxiosResponse<any>) => AxiosResponse<any>
	responseErrorHooks?: (error: any) => Promise<any>
}

export const defaultHooks = {
	requestSuccessHook: (config: AxiosRequestConfig) => {
		return config
	},
	requestErrorHooks: (error) => {
		return Promise.reject(error)
	},
	responseSuccessHooks: (response) => {
		return response.data
	},
	responseErrorHooks: (error) => {
		return Promise.reject(error)
	}
}

export const httpAxios = (options: AxiosRequestConfig = {}, hooks: AxiosHooks = {}) => {
	const instance = axios.create(options)

	instance.interceptors.request.use(
		(config) => {
			// if (isDev){
			// 	console.info(hooks?.requestSuccessHook, 'requestSuccessHook is empty, use default requestSuccessHook')
			// }

			// get 请求无法加上content-type解决方法
			if (config.method === 'get') {
				config.data = { unused: 0 }
			}

			if (!hooks.requestSuccessHook) {
				return defaultHooks.requestSuccessHook(config)
			}

			return hooks.requestSuccessHook!(config)
		},
		(error) => {
			// if (isDev) {
			// 	warning(hooks?.requestErrorHooks, 'requestSuccessHook is empty, use default requestErrorHooks')
			// }

			if (!hooks.requestErrorHooks) {
				return defaultHooks.requestErrorHooks(error)
			}

			return hooks.requestErrorHooks(error)
		}
	)

	instance.interceptors.response.use(
		function (response) {
			// Any status code that lie within the range of 2xx cause this function to trigger
			// Do something with response data
			// if (isDev) {
			// 	warning(hooks?.responseSuccessHooks, 'responseSuccessHooks is empty, use default responseSuccessHooks')
			// }

			if (!hooks.responseSuccessHooks) {
				return defaultHooks.responseSuccessHooks(response)
			}

			return hooks.responseSuccessHooks(response)
		},
		function (error) {
			// if (isDev) {
			// 	warning(hooks?.responseErrorHooks, 'responseErrorHooks is empty, , use default responseErrorHooks')
			// }

			if (!hooks.responseErrorHooks) {
				return defaultHooks.responseErrorHooks(error)
			}

			return hooks.responseErrorHooks(error)
		}
	)
	return instance
}
