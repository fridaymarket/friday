import React from 'react'

import * as css from './css'

interface DevelopmentLogin {
	title?: string
	onSumbit(username: string, password: string): void
}

const DevelopmentLogin: React.FC<DevelopmentLogin> = ({ onSumbit }) => {
	const onPrivateSumbit = (event) => {
		event.preventDefault()
		onSumbit(event.target.username.value, event.target.password.value)
	}

	const title = document.title || '微服务通用登陆页面'
	return (
		<div style={css.microMain}>
			<div style={css.microTitle}>{title}</div>
			<form onSubmit={onPrivateSumbit} style={css.microForm}>
				<div style={css.microBlockDiv}>
					<span style={css.microLabel}>Name:</span>
					<input style={css.microInput} type="text" name="username" />
				</div>
				<div style={css.microBlockDiv}>
					<span style={css.microLabel}>Password:</span>
					<input style={css.microInput} type="text" name="password" />
				</div>
				<div style={css.microBlockDiv}>
					<input type="submit" value="Submit" style={css.microInput} />
				</div>
			</form>
		</div>
	)
}

export default DevelopmentLogin
