import React from 'react'
import { useLocation } from 'react-router-dom'

const DefaultPanel = () => {
	const location = useLocation()
	return (
		<div>{location?.pathname || "null"}</div>
	)
}

export default DefaultPanel
