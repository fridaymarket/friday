import React from 'react'
import { createContext } from 'friday-helpers'

export default function GlobalState_middleware<T extends {}>(initialState: T) {
	const { Provider: GlobalProvider, useContextProvider } = createContext<T>(initialState)

	return {
		useGlobalContext: useContextProvider,
		middleware: ({ App, configuration }) => {
			return {
				App(props) {
					return (
						<GlobalProvider>
							<App {...props} />
						</GlobalProvider>
					)
				},
				configuration
			}
		}
	}
}
