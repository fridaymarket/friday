import { IConfiguration } from 'friday-core'

const { protocol } = document.location

const configuration: IConfiguration = {
	whiteHosts: ['localhost:3001', 'localhost:3000'],
	publicUrl: {
		baseUrl: 'http://localhost:3000/mock/8/test'
	},
	router: {
		baseName: 'app'
	}
	// sentry: {
	// 	dsn: 'dns',
	// 	environment: process.env.NODE_ENV
	// }
}

export default configuration
