import { configurationService } from './index'

describe('configuration.service', () => {
	it('match exception [无法匹配到host]', async () => {
		try {
			configurationService.injectConfigurations([
				{
					whiteHosts: ['localhost:3000'],
					publicUrl: { baseUrl: '' }
				}
			])
		} catch (e) {
			expect(e.message).toBe(
				`[configurations whiteHosts] host: localhost cannot match configuration`
			)
		}
	})

	it('match exception [whiteHosts 类型错误]', async () => {
		try {
			configurationService.injectConfigurations([
				{
					whiteHosts: {} as any,
					publicUrl: { baseUrl: '' }
				}
			])
		} catch (e) {
			expect(e.message).toBe(`[configurations whiteHosts] should be array, but got object`)
		}
	})

	it('match exception [publicUrl 类型错误]', async () => {
		try {
			configurationService.injectConfigurations([
				{
					whiteHosts: ['localhost:3000'],
					publicUrl: '' as any
				}
			])
		} catch (e) {
			expect(e.message).toBe('[configurations publicUrl] should be object, but got string')
		}
	})

	it('match exception [publicUrl key不一致]', async () => {
		try {
			configurationService.injectConfigurations([
				{
					whiteHosts: ['localhost:3000'],
					publicUrl: { url: '' }
				},
				{
					whiteHosts: ['localhost:3000'],
					publicUrl: {
						url2: ''
					}
				}
			])
		} catch (e) {
			expect(e.message).toBe(
				'配置中的publicUrl key不一致，请保持一致，否则可能导致某个环境下出现异常'
			)
		}
	})

	it('match exception [injectConfigurations 参数错误]', async () => {
		try {
			configurationService.injectConfigurations(undefined)
		} catch (e) {
			expect(e.message).toBe(
				'[configurations whiteHosts] host: localhost cannot match configuration'
			)
		}
	})

	it('match exception [whiteHosts 匹配多个]', async () => {
		try {
			configurationService.injectConfigurations([
				{
					whiteHosts: ['localhost'],
					publicUrl: { baseUrl: '' }
				},
				{
					whiteHosts: ['localhost'],
					publicUrl: { baseUrl: '' }
				}
			])
		} catch (e) {
			expect(e).toBe(
				'Warning: [configurations whiteHosts] host 匹配到了多个config，将使用第一个config'
			)
		}
	})

	it('match exception [router 类型错误]', async () => {
		const defualt = {
			whiteHosts: ['localhost'],
			publicUrl: { baseUrl: '' },
			router: '' as any
		}

		const config = configurationService.injectConfigurations([defualt])

		expect(config).toEqual({
			NODE_ENV: 'test',
			history: config.history,
			...defualt
		})
	})

	it('match normal', async () => {
		const defualt = {
			whiteHosts: ['localhost'],
			publicUrl: { baseUrl: '' },
			router: {
				baseName: '/'
			}
		}

		const config = configurationService.injectConfigurations([defualt])

		expect(config).toEqual({
			NODE_ENV: 'test',
			history: config.history,
			...defualt
		})

		const getConfigResult = configurationService.getConfiguration()
		expect(getConfigResult).toEqual({
			NODE_ENV: 'test',
			history: getConfigResult.history,
			...defualt
		})
	})
})
