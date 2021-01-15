import React from 'react'
import CreateService from './create.service'

describe('create.service', () => {
	it('create match exception', () => {
		try {
			const app = new CreateService()

			app.injectRouters(() => <div>hello friday</div>)

			app.injectConfigurations([
				{
					whiteHosts: ['localhost:3000'],
					publicUrl: { baseUrl: '' }
				}
			])
			app.start('root')
		} catch (error) {
			expect(error.message).toBe(
				'[inject router] configuration must be registered before app.injectRouters()'
			)
		}
	})
})
