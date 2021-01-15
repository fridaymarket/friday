import React from 'react'
import { render } from '@testing-library/react'

import {
	request_middleware,
	createGetApi,
	createPostApi,
	dispatchAsync,
	httpAxios,
	axiosService,
	defaultHooks
} from './index'
import { getDisasterRecoveryData } from './useRequest/utils'

describe('friday async', () => {
	it('getDisasterRecoveryData(object) match normal', async () => {
		const { responseJson, responseArray } = getDisasterRecoveryData({
			data: {}
		} as any)

		expect(responseArray).toEqual({ data: [] })
		expect(responseJson).toEqual({ data: {} })
	})

	it('getDisasterRecoveryData(array) match normal', async () => {
		const { responseArray, responseJson } = getDisasterRecoveryData({
			data: []
		} as any)
		expect(responseArray).toEqual({ data: [] })
		expect(responseJson).toEqual({ data: {} })
	})

	it('getDisasterRecoveryData(undefined) match normal', async () => {
		const { responseArray, responseJson } = getDisasterRecoveryData(undefined)
		expect(responseArray).toEqual({ data: [] })
		expect(responseJson).toEqual({ data: {} })
	})

	it('getDisasterRecoveryData(undefined) match exception', async () => {
		try {
			getDisasterRecoveryData({} as any)
		} catch (error) {
			expect(error).toEqual('Warning: 接口返回格式错误, data没返回，或者不是array | object')
		}
	})

	it('request_middleware match normal', async () => {
		const httpInstance = httpAxios()

		const middleware = request_middleware(httpInstance, {
			fetcher: (params) => httpInstance(params) as any
		})

		const AppChildren = () => <div>test</div>

		const configuration = {
			whiteHosts: ['127.0.0.1:3000'],
			publicUrl: {}
		}

		const { App } = middleware({ App: AppChildren, configuration })

		const { container } = render(<App />)

		expect(axiosService.getAixosInstance()).toEqual(httpInstance)
		expect(container.textContent).toBe('test')
	})

	it('createGet match normal', () => {
		const resultConfig = (createGetApi({ url: '/test_get' })({
			test: 123
		}) as any)()
		expect(resultConfig).toEqual({
			url: '/test_get',
			params: { test: 123 },
			method: 'get'
		})
	})

	const getApiPost = createPostApi({ url: '/test_post' })

	it('createPost match normal', () => {
		const resultConfig = (getApiPost({ test: 123 }) as any)()
		expect(resultConfig).toEqual({
			url: '/test_post',
			data: { test: 123 },
			method: 'post'
		})
	})

	it('dispatchAsync match exception 1', async () => {
		try {
			axiosService.setAixosInstance(undefined as any)

			await dispatchAsync('test' as any)
		} catch (error) {
			expect(error.message).toBe('[dispatchAsync] axiosInstance not found')
		}
	})

	it('dispatchAsync match exception 2', async () => {
		try {
			const mockAxios = async (axiosConfig) => {
				return axiosConfig
			}

			axiosService.setAixosInstance(mockAxios as any)
			await dispatchAsync('ste' as any)
		} catch (error) {
			expect(error.message).toBe(
				'[dispatchAsync]  service not found, service must be object or function'
			)
		}
	})

	it('dispatchAsync match exception 3', async () => {
		try {
			const mockAxios2 = async (axiosConfig) => {
				return { data: '' }
			}
			axiosService.setAixosInstance(mockAxios2 as any)

			await dispatchAsync(getApiPost({ test: 1 }))
		} catch (error) {
			expect(error).toBe('Warning: 接口返回格式错误, data没返回，或者不是array | object')
		}
	})

	it('dispatchAsync match normal', async () => {
		const mockAxios2 = async (axiosConfig) => {
			return { data: { test: 'true' } }
		}
		axiosService.setAixosInstance(mockAxios2 as any)

		const result = await dispatchAsync(createGetApi({ url: '/test_get' })({ test: 123 }))
		expect(result.data).toEqual({ test: 'true' })
	})

	it('httpAxios hooks match normal', async () => {
		const result = defaultHooks.requestSuccessHook({ test: 1 } as any)

		expect(result).toEqual({ test: 1 })

		defaultHooks.requestErrorHooks({ test: 1 }).catch((result2) => {
			expect(result2).toEqual({ test: 1 })
		})

		const result3 = defaultHooks.responseSuccessHooks({ data: 1 })
		expect(result3).toEqual(1)

		defaultHooks.responseErrorHooks(1).catch((result4) => {
			expect(result4).toEqual(1)
		})
	})
})
