import React from 'react'

import { RouteProps, Route } from 'react-router-dom'

interface RefereeRouterProps extends RouteProps {
	condition(): boolean
	victoryComponent: React.FC<any>
	failComponent: React.FC<any>
}

const RefereeRouter: React.FC<RefereeRouterProps> = (props) => {
	const { condition, victoryComponent, failComponent, ...rest } = props

	const realComponent = condition() ? victoryComponent : failComponent

	return <Route {...rest} component={realComponent} />
}

export default RefereeRouter
