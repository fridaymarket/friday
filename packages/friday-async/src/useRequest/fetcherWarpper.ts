import invariant from 'invariant'

export declare type fetcherFn<Data> = ((...args: any) => Data | Promise<Data>) | null

export const fetcherWarpper = (fetcher) => {
	if (!fetcher) return undefined

	return <Data>(axiosConfigString): fetcherFn<Data> => {
		let axiosConfig
		try {
			axiosConfig = JSON.parse(axiosConfigString)
		} catch (error) {
			axiosConfig = new Error(error)
		}

		if (axiosConfig instanceof Error) {
			invariant(false, '[fetcher parse] axiosConfig parse error')
		}
		return fetcher(axiosConfig) as fetcherFn<Data>
	}
}
