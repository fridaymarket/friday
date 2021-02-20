
import { httpAxios } from './httpAxios'


describe('httpAxios', () => {
	// 测试钩子是否被调用
	it('inject httpAxios hooks', async () => {

		const mockCallback = jest.fn()

		const injectHooksAxios = httpAxios({}, {
			requestSuccessHook(config) {
				mockCallback()
				return config
			},
			requestErrorHooks(config) {
				mockCallback()
				return config
			},
		})

		const request = injectHooksAxios.interceptors.request as any

		request.handlers[0].fulfilled({
			method: 'get'
		})

		request.handlers[0].rejected({})

		expect(mockCallback.mock.calls.length).toBe(2);

	})
})