import React from 'react'
import invariant from 'invariant'
import { configurationService, IResponseConfiguration } from './index'

const useConfiguration = <T = IResponseConfiguration>() => {
	const config = React.useMemo(() => configurationService.getConfiguration<T>(), [])

	invariant(config, '[useConfiguration]: configuration no initial')

	return config
}

export default useConfiguration
