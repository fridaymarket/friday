import React from 'react'
import invariant from 'invariant'
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

	// Dynamically change the key according to the timing of run
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

	if ((config as any).isPaused) {
		invariant(false, 'manual model cannot be set isPaused')
	}

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
		dynamicParams.current = new Date().getTime()
		rerender({})
	}

	return {
		...response,
		run
	}
}

export default useManalRequest

