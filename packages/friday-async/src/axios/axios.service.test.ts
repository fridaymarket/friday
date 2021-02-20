
import AxiosService from './axios.service'
import { httpAxios } from './httpAxios'

describe('AxiosService', () => {
	
	it('AxiosService match normal', async () => {
		const axiosServiceInstance = new AxiosService()

		const httpInstance = httpAxios()

		axiosServiceInstance.setAixosInstance(httpInstance)

		expect(axiosServiceInstance.getAixosInstance()).toBe(httpInstance)
	})
})
