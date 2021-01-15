import { getConfiguration } from 'friday-core'
import { httpAxios, request_middleware } from 'friday-async'

const { publicUrl } = getConfiguration()

export const axiosConifg = {
	baseURL: publicUrl.baseUrl,
	timeout: 20000,
	headers: {
		Accept: 'application/json;charset=utf-8',
		'Content-Type': 'application/json;charset=utf-8',
		'Y-Language': ''
	}
}

export const axiosInstance = httpAxios(axiosConifg, {
	requestSuccessHook(config) {
		return { ...config, headers: { ...config.headers, token: '222' } }
	},
	responseErrorHooks(error) {
		const status = error.response.status
		console.log(error, 'error')
		return Promise.reject(error)
	}
})

const axios_middleware = request_middleware(axiosInstance, {
	fetcher: (params) => axiosInstance(params) as any
})

export default axios_middleware
