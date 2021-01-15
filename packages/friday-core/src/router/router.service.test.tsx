import React from 'react'
import { render } from '@testing-library/react'
import { routerServiceInstance } from './index'

describe('router.service', () => {
	it('injectRouters match exception', () => {
		try {
			routerServiceInstance.injectRouters({} as any)
		} catch (error) {
			expect(error.message).toBe(
				`[inject router] component should be function, but got object`
			)
		}
	})

	it('injectRouters match normal', () => {
		routerServiceInstance.injectRouters(() => <div>todo</div>)

		const history = routerServiceInstance.getHistory({ basename: '' })
		const Router = () => routerServiceInstance.getRouter({ history })

		const { container } = render(<Router />)

		expect(container.textContent).toBe('todo')
	})
})
