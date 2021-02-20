import { createGetApi, createPostApi } from '../genarateApi'
import { renderHook, act } from '@testing-library/react-hooks'
import useRequest from './index'

describe('useRequest', () => {

	it('General Get Request', async () => {
		const getApi = createGetApi<void>({ url: '/a' })
		const fetcher = (config) => {
			return {
				...config,
				data: {test: 1}
			}
		}
		
		const { result, waitFor } = renderHook(() => useRequest(getApi(), {
			fetcher,
		}))

		await waitFor(() => expect(result.current.dataJson).toMatchObject({test: 1}))
	})

	it('General post Request', async () => {

		const postApi = createPostApi<void>({ url: '/a' })
		const fetcher = (config) => {
			return {
				...config,
				data: {test: 1}
			}
		}
		
		const { result, waitFor } = renderHook(() => useRequest(postApi(), {
			fetcher,
		}))
		await waitFor(() => expect(result.current.dataJson).toMatchObject({test: 1}))
	})

	it('General paginated Request', async () => {
		const getApi = createGetApi<void>({ url: '/a' })
		const fetcher = (config) => {
			return {
				...config,
				data: {test: 1}
			}
		}
		
		const { result, waitFor } = renderHook(() => useRequest(getApi(), {
			fetcher,
			paginated: true
		}))

		await waitFor(() => {
			expect(result.current.dataJson).toMatchObject({ test: 1 })
			expect(result.current.params).toMatchObject({ page: 1, pageSize: 10 })
			expect(result.current.onLoadMore).toBeTruthy()
		})
		
	})

	it('General loadMore Request', async () => {

		const getApi = createGetApi<void>({ url: '/abc' })
		const fetcher = (config) => {
			return {
				...config,
				data: [{ test: 1 }]
			}
		}
		
		const { result, waitForValueToChange } = renderHook(() => useRequest(getApi(), {
			fetcher,
			loadMore: true
		}))

		await waitForValueToChange(() => result.current.list);
		expect(result.current.list).toMatchObject([{ test: 1 }])

		act(() => {
			result.current.onLoadMore()
		});
		
		await waitForValueToChange(() => result.current.list);
		expect(result.current.params).toMatchObject({ page: 2, pageSize: 10 })
	})

	it('General manual Request', async () => {

		const getApi = createGetApi<void>({ url: '/abc' })

		const mockCallback = jest.fn()

		const fetcher = (config) => {
			return {
				...config,
				data: [{ test: 1 }]
			}
		}

		const { result, waitFor } = renderHook(() => useRequest(getApi, {
			fetcher,
			manual: true,
			onSuccess: () => {
				mockCallback()
			}
		}))

		await waitFor(() => {
			expect(result.current.dataArray).toMatchObject([])
		})

		// 触发
		act(() => result.current.run())
		
		await waitFor(() => {
			expect(mockCallback.mock.calls.length).toBe(1);
		})
	})
})