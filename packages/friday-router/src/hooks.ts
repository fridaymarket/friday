import { useEffect, useMemo } from 'react'
import { useLocation, useHistory, useParams, useRouteMatch } from 'react-router-dom'
import queryString from 'query-string'
export const useQuery = () => {
	return new URLSearchParams(useLocation().search)
}

export const useScrollTop = () => {
	const history = useHistory()
	useEffect(() => {
		const unlisten = history.listen(() => {
			window.scrollTo(0, 0)
		})
		return unlisten
	}, [history])
}

export function useRouter() {
	const params = useParams()
	const location = useLocation()
	const history = useHistory()
	const match = useRouteMatch()

	// Return our custom router object
	// Memoize so that a new object is only returned if something changes
	return useMemo(() => {
		return {
			// For convenience add push(), replace(), pathname at top level
			// push: history.push,
			// replace: history.replace,
			// pathname: location.pathname,
			// Merge params and parsed query string into single "query" object
			// so that they can be used interchangeably.
			// Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
			query: {
				...queryString.parse(location.search), // Convert string to object
				...params
			},
			// Include match, location, history objects so we have
			// access to extra React Router functionality if needed.
			match,
			location,
			history
		}
	}, [params, match, location, history])
}
