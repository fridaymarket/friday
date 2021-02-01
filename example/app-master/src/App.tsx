import React from 'react'
import { Switch, Route, Router } from 'friday-router'
import PrimaryRoutes from 'src/pages/layout/PrimaryRoutes'
import Home from './pages/home'

const App = ({ history }) => {
	return (
		<Router history={history}>
			<Switch>
				<Route path="/" component={PrimaryRoutes} />
			</Switch>
		</Router>
	)
}

export default App
