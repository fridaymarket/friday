import React from 'react'
import { Link, useLocation } from 'friday-router'
import { Layout, Menu, Breadcrumb } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './layout.less'

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const Index = ({ children}) => {

	const { pathname } = useLocation()

	return (
		<Layout>
			<Header className="header">
				<div className="logo" />
			</Header>
			<Content style={{ padding: '0 50px' }}>
				<Breadcrumb style={{ margin: '16px 0' }}>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>List</Breadcrumb.Item>
					<Breadcrumb.Item>App</Breadcrumb.Item>
				</Breadcrumb>
				<Layout className="site-layout-background" style={{ padding: '24px 0' }}>
					<Sider className="site-layout-background" width={200}>
						<Menu
							mode="inline"
							defaultOpenKeys={['sub1']}
							style={{ height: '100%' }}
						>
							<SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
								<Menu.Item key="1"><Link to='/option1'>option1</Link></Menu.Item>
								<Menu.Item key="2"><Link to='/micro1'>micro1</Link></Menu.Item>
							</SubMenu>
						</Menu>
					</Sider>
					<Content style={{ padding: '0 24px', minHeight: 280 }}>
						{pathname.indexOf('micro') > -1 ? <div id='micro-layout'></div> : children}
					</Content>
				</Layout>
			</Content>
			<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
		</Layout>
	)
}

export default Index
