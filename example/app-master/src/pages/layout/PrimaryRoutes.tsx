import React from 'react'
import { Switch, Route } from 'friday-router'
import Layout from './index'
import Default from './Default'

const PrimaryRoutes = () => {
	return (
		<Layout>
			<Switch>
				<Route path='*' exact component={Default} />
			</Switch>
		</Layout>
	)
}

export default PrimaryRoutes
