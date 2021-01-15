import React from 'react'
import { render } from '@testing-library/react'

import { middlewareService, GlobalState_middleware } from './index'

describe('middleware.service', () => {
	it('getMiddleware match normal', async () => {
		const middleware = middlewareService.getMiddleware()
		expect(middleware.length).toBe(0)
	})

	it('use functions match exception ', async () => {
		try {
			middlewareService.use({} as any)
		} catch (e) {
			expect(e.message).toBe(
				'[MiddlewareService use] middleware should be function or function[], but got object'
			)
		}
	})

	it('use functions match normal', async () => {
		middlewareService.use(GlobalState_middleware({ test2: 123 }).middleware)
		const currentMiddleware = middlewareService.getMiddleware()
		expect(currentMiddleware.length).toBe(1)
	})

	it('apply Middleware match normal', async () => {
		const App = () => <div>Hello, Jenny!</div>

		const configuration = {
			whiteHosts: ['127.0.0.1:3000'],
			publicUrl: {
				test: 'test'
			}
		}
		const ResultApp = middlewareService.apply({ App, configuration })

		const { container } = render(<ResultApp />)

		expect(container.textContent).toBe('Hello, Jenny!')
	})
})
