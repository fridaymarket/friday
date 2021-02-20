

import { createContext } from 'react'
import { AxiosInstance } from 'axios'
import { ConfigInterface } from './type'


export interface RequestMiddleware extends ConfigInterface {
	axiosInstance: AxiosInstance
}	

export const AsyncConfigContext = createContext<RequestMiddleware>({} as RequestMiddleware)