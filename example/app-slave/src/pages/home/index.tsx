import React from 'react'
import { Button } from 'antd'
import logo from '../../logo.jpg'
import './home.less'

const Home = () => {
	return (
		<div>
			<div className="center">
				<img src={logo} />
			</div>
			<div className="center">
				<Button className="docs">
					<a href="http://192.168.5.94:9060/" target="blank">
						开发文档
					</a>
				</Button>
			</div>
		</div>
	)
}

export default Home
