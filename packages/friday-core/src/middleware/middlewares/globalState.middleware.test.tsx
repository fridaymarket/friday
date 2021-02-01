import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { middlewareService } from '../index'
import GlobalState_middleware from './globalState.middleware'

it('GlobalState_middleware', () => {
	const App = ({ children }) => <div>{children}</div>

	const configuration = {
		whiteHosts: ['127.0.0.1:3000'],
		publicUrl: {
			test: 'test'
		}
	}

	const { middleware, useGlobalContext } = GlobalState_middleware({
		test: 123
	})

	middlewareService.use(middleware)

	const ResultApp = middlewareService.apply({ App, configuration })

	const { result } = renderHook(() => useGlobalContext(), {
		wrapper: ResultApp
	})

	act(() => {
		result.current.dispatch({ type: 'test', value: 333 })
	})

	expect(result.current.state.test).toBe(333)
})
