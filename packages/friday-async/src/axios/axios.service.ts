
import { AxiosInstance } from 'axios'


export default class AxiosService {

	private aixosInstance!: AxiosInstance

	public setAixosInstance = (axiosInstance: AxiosInstance) => {
		this.aixosInstance = axiosInstance
	}

	public getAixosInstance = () => {
		return this.aixosInstance
	}
}
