import { renderHook } from '@testing-library/react-hooks'
import { useConfiguration, configurationService } from './index'

describe('configuration.service', () => {
	it('useConfiguration exception', async () => {
		const { result } = renderHook(() => useConfiguration())

		expect(result.error).toEqual(Error('[useConfiguration]: configuration no initial'))
	})

	it('useConfiguration normal', async () => {
		const defualt = {
			whiteHosts: ['localhost'],
			publicUrl: { baseUrl: '' },
			router: {
				baseName: '/'
			}
		}

		const config = configurationService.injectConfigurations([defualt])

		const { result } = renderHook(() => useConfiguration())

		expect(result.current).toEqual({
			NODE_ENV: 'test',
			history: config.history,
			...defualt
		})
	})
})
