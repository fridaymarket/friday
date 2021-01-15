import DeferredSerivce from './index'

describe('process.service', () => {
	it('inject_finally match normal', () => {
		class Test extends DeferredSerivce {
			constructor() {
				super()
				this.inject_finally()
			}
		}

		const testInstace = new Test()
		expect(!!testInstace.deferred).toBe(true)
	})
})
