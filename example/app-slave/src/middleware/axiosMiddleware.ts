import { getConfiguration } from 'friday-core'
import { httpAxios, request_middleware } from 'friday-async'

const { publicUrl } = getConfiguration()

export const axiosConifg = {
	baseURL: publicUrl.baseUrl,
	timeout: 20000,
	headers: {
		Accept: 'application/json;charset=utf-8',
		'Content-Type': 'application/json;charset=utf-8',
	}
}

export const axiosInstance = httpAxios(axiosConifg, {
	requestSuccessHook(config) {
		return { ...config, headers: { ...config.headers, token: '222' } }
	},
	responseErrorHooks(error) {
		return Promise.reject(error)
	}
})

const axios_middleware = request_middleware({axiosInstance})

export default axios_middleware
