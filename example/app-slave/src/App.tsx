import React from 'react'
import { Switch, Route, Router } from 'friday-router'
import Home from './pages/home'

const App = ({ history }) => {
	return (
		<Router history={history}>
			<Switch>
				<Route path="/" component={Home} />
			</Switch>
		</Router>
	)
}

export default App
