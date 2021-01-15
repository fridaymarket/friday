import React from 'react'
import { IRenderService } from './render'

export class RenderService implements IRenderService {
	private container!: string

	private RootComponent!: React.FC

	constructor(container: string, RootComponent: React.FC<any>) {
		this.container = container
		this.RootComponent = RootComponent
	}

	public bootstrap = async () => {
		return Promise.resolve()
	}
	/**
	 *
	 * @param props 外部传入(master 服务)
	 */
	public mount = async (props) => {
		const ReactDOM = require('react-dom')
		const { container } = props
		return ReactDOM.render(
			React.createElement(this.RootComponent, props),
			container
				? container.querySelector(this.container)
				: document.querySelector(this.container)
		)
	}

	public unmount = async (props) => {
		const ReactDOM = require('react-dom')
		const { container } = props
		return ReactDOM.unmountComponentAtNode(
			container
				? container.querySelector(this.container)
				: document.querySelector(this.container)
		)
	}

	public render() {
		if (!(window as any).__POWERED_BY_QIANKUN__) {
			return this.mount({})
		}
	}
}
