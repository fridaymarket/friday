import { createGetApi, createPostApi } from '../genarateApi'

import { 
	genarateServiceConfig,
	contrastServiceParams,
	getServiceParams,
	mergeServiceParams,
	getDisasterRecoveryData,
	fetcherWarpper
} from './utils'


describe('utils', () => {
	it('genarateServiceConfig match object service', () => {
		const apiConfig = { url: '/a' }
		const api = createGetApi<void>(apiConfig)()()
		expect(genarateServiceConfig(api)).toMatchObject(apiConfig)
	})

	it('genarateServiceConfig match function service', () => {
		const apiConfig = { url: '/a' }
		const api = createGetApi<void>(apiConfig)()
		expect(genarateServiceConfig(api)).toMatchObject(apiConfig)
	})

	it('genarateServiceConfig match null', () => {
		expect(genarateServiceConfig(null)).toBe(null)
	})

	it('getServiceParams match normal', () => {
		const service = createGetApi({ url: '/a', method: 'get' as any })({
			test: 1
		})
		expect(getServiceParams(service)).toMatchObject({"test": 1})

	})

	it('getServiceParams match null', () => {
		try {
			getServiceParams(null)
		} catch (error) {
			expect(error).toBe('service is null')
		}
	})



	it('contrastServiceParams match normal', () => {
		const service_1 = createGetApi({ url: '/a' })({ test: 1 })
		const service_2 = createGetApi({ url: '/a'})({ test: 1 })

		expect(contrastServiceParams(service_1, service_2)).toBeTruthy()
	})

	it('contrastServiceParams match normal2', () => {
		const service_1 = createGetApi({ url: '/a'})({ test: 1 })
		const service_2 = createGetApi({ url: '/a'})({ test: 2 })
		expect(contrastServiceParams(service_1, service_2)).toEqual(false)
	})

	it('contrastServiceParams match normal3', () => {
		const service_1 = createGetApi({ url: '/a'})({ test: 1 })
		const service_2 = createPostApi({ url: '/a' })({ test: 1 })

		expect(contrastServiceParams(service_1, service_2)).toEqual(true)
	})

	it('mergeServiceParams exception', () => {
		try {
			mergeServiceParams(undefined as any, { test2: 1 })
		} catch (error) {
			expect(error.message).toBe('service 不合法')
		}
	})


	it('mergeServiceParams get method', () => {
		const service_result = createGetApi({ url: '/a'})({ test: 1 })()
		const result = mergeServiceParams(service_result, { test2: 1 })
		
		expect(result).toMatchObject({
			method: 'get',
			params: {
				test: 1,
				test2: 1
			},
			url: '/a'
		})
	})

	it('mergeServiceParams get method', () => {
		const service_result = createGetApi({ url: '/a'})({ test: 1 })()
		const result = mergeServiceParams(service_result, undefined as any)
		expect(result).toMatchObject({
			method: 'get',
			params: {
				test: 1,
			},
			url: '/a'
		})
	})

	it('mergeServiceParams post method1', () => {
		const service_result = createPostApi({ url: '/a'})({ test: 1 })()
		const result = mergeServiceParams(service_result, { test2: 1 })
		
		expect(result).toMatchObject({
			method: 'post',
			data: {
				test: 1,
				test2: 1
			},
			url: '/a'
		})
	})

	it('mergeServiceParams post method2', () => {
		const service_result = createPostApi({ url: '/a'})({
			test: 1
		})()

		const result = mergeServiceParams(service_result, undefined as any)
		
		expect(result).toMatchObject({
			method: 'post',
			data: {
				test: 1,
			},
			url: '/a'
		})
	})

	it('getDisasterRecoveryData2', () => {
		try {
			getDisasterRecoveryData({data: ''} as any, false)
		} catch (error) {
			expect(error).toBe('Warning: 接口返回格式错误, data没返回，或者不是array | object')
		}
	})

	it('getDisasterRecoveryData(object) match normal', async () => {

		const { responseJson, responseArray } = getDisasterRecoveryData({
			data: {}
		} as any)

		expect(responseArray).toEqual({data: []})
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

	it('getDisasterRecoveryData(undefined) match blob', async () => {

		try {
			getDisasterRecoveryData({} as any, true)
		} catch (error) {
			expect(error).toEqual('Warning: 接口返回格式错误, data没返回，或者不是array | object')
		}
	})

	it('fetcherWarpper normal', () => {
		const mockCallback = jest.fn(x => x)
		const result = (fetcherWarpper(mockCallback) as Function)("{\"test\":1}")

		expect(result).toMatchObject({test: 1})
	})

	it('fetcherWarpper normal undefined', () => {
		const result = (fetcherWarpper(undefined) as Function)

		expect(result).toEqual(undefined)
	})

	it('fetcherWarpper exception', () => {
		const mockCallback = jest.fn(x => x)

		try {
			 (fetcherWarpper(mockCallback) as Function)("{'test':1}")
		} catch (error) {
			expect(error.message).toEqual("[fetcher parse] axiosConfig parse error")
		}
		
	})
})