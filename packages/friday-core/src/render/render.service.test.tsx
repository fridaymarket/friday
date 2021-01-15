import React from 'react'
import RenderService from './index'

describe('router.service', () => {
	let container = null as any
	beforeEach(() => {
		container = document.createElement('root')
		document.body.appendChild(container)
	})

	const renderInstance = new RenderService('root', () => <div>render service</div>)

	it('RenderService bootstrap match normal', () => {
		const result = renderInstance.bootstrap()
		expect(result).toBeTruthy()
	})

	it('Non microservices mount match normal', async () => {
		const result = await renderInstance.mount({})
		expect(result).toBeNull()
	})

	it('microservices mount match normal', async () => {
		const result = await renderInstance.mount({ container: document })
		expect(result).toBeFalsy()
	})

	it('Non microservices unmount match normal', async () => {
		const result = await renderInstance.unmount({})
		expect(result).toBeTruthy()
	})

	it('microservices unmount match normal', async () => {
		const result = await renderInstance.unmount({ container: document })
		expect(result).toBeFalsy()
	})

	it('microservices render match nomal ', () => {
		;(window as any).__POWERED_BY_QIANKUN__ = true
		const result = renderInstance.render()
		expect(result).toBeFalsy()
		delete (window as any).__POWERED_BY_QIANKUN__
	})

	it('Non microservices render match nomal ', async () => {
		const result = await renderInstance.render()
		expect(result).toBeNull()
	})
})
