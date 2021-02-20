import React from 'react'
import useAsync from './useAsync'
import {
	HeadService,
	ManualService,
	ManualConfigInterface,
	ManualResult,
} from './type'

function useManalRequest<Params, Data>(
	service: ManualService<Params, Data>,
	config: ManualConfigInterface<Data>
): ManualResult<Params, Data> {

	const pausedRef = React.useRef(true)

	const rerender = React.useState<any>(null)[1]

	const paramsRef = React.useRef<any>({})

	const dynamicParams = React.useRef<any>({ _: new Date().getTime()})

	const nextService = React.useMemo(() => {
		// service is HeadService, will be return LastService
		return (service as HeadService)(paramsRef.current, {_ : dynamicParams.current})
	}, [
		dynamicParams,
		paramsRef.current
	])

	const pauper = React.useCallback(() => {
		pausedRef.current = true
	}, [])

	// config, 不应该动态修改
	const nextConfig: any = {
		...config,
		onSuccess: (...res) => {
			pauper()
			config.onSuccess && (config as any).onSuccess(...res)
		},
		onError: (...res) => {
			pauper()
			config.onError && (config as any).onError(...res)
		},
		isPaused() {
			return pausedRef.current
		}
	}

	const response = useAsync(nextService, nextConfig)

	const run = (params) => {
		pausedRef.current = false
		paramsRef.current = params
		// 更改key，触发请求。
		dynamicParams.current = new Date().getTime()
		rerender({})
	}

	return {
		...response,
		run
	}
}

export default useManalRequest

