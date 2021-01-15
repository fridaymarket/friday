import React from 'react'
import { History, BrowserHistoryBuildOptions } from 'history'
import { IDeferredSerivce } from '../process'

export interface InjectProps {
	history: History
	[x: string]: any
}

export type IRouterFunc = React.FC<InjectProps>

export interface IRouterService extends IDeferredSerivce {
	injectRouters(Router: IRouterFunc): void
	getRouter(props: InjectProps): React.ReactElement<any, any> | null
	getHistory(options: BrowserHistoryBuildOptions): History
}
