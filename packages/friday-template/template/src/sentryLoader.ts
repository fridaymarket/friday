import { init } from '@sentry/browser'

const sentryLoader = (options) => {
	init(options)
}

export default sentryLoader
