import React from 'react'

import { RouteProps, Route } from 'react-router-dom'

interface ConditionRouterProps extends RouteProps {
	condition(): boolean
	component: React.FC<any>
}

const ConditionRouter: React.FC<ConditionRouterProps> = (props) => {
	const { condition, component, ...rest } = props

	if (condition()) {
		return <Route {...rest} component={component} />
	}

	return null
}

export default ConditionRouter
