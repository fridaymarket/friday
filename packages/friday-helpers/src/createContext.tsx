import React from 'react'
import invariant from 'invariant'
import { useImmerReducer } from 'friday-immer'
import { isArray } from './isArray'
import { noop } from './noop'

export interface Action<T> {
	type: T
	value: any
}

export type contextAction<T> = Action<keyof T> | Action<keyof T>[]

export type ContextDispatch<T> = React.Dispatch<Action<keyof T> | Action<keyof T>[]>

export interface ContextValue<T> {
	reset: () => void
	state: T
	dispatch: ContextDispatch<T>
}

export const createContext = <T extends object>(initialState: T) => {
	const Context = React.createContext<ContextValue<T>>({
		reset: noop,
		state: initialState,
		dispatch: noop
	} as ContextValue<T>)

	const reducer = (draft, action) => {
		// batch action
		if (isArray(action)) {
			return action.forEach((c) => {
				draft[c.type] = c.value
			})
		}

		draft[action.type] = action.value
	}

	const Provider = ({ children, value = {} }) => {
		const nextInitial = { ...initialState, ...value }

		const [state, dispatch] = useImmerReducer<T, contextAction<T>>(reducer, nextInitial)

		const reset = () => {
			const actions = Object.keys(nextInitial).map((key) => ({
				type: key,
				value: nextInitial[key]
			}))
			dispatch(actions as Action<keyof T>[])
		}

		return <Context.Provider value={{ state, dispatch, reset }}>{children}</Context.Provider>
	}

	const useContextProvider = () => {
		invariant(Context, '[Context] not found')
		const response = React.useContext(Context)
		return response
	}

	return {
		Context,
		Provider,
		useContextProvider
	}
}
