import home_api from 'src/pages/home/api'

export const apis = {
	home: new home_api()
}

export type IApis = typeof apis
