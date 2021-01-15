import React from 'react'
// import { Button } from 'antd'

export default function ChunkLazy(lazyImport) {
	return React.lazy(() =>
		lazyImport().catch((error) => {
			if (error.toString().indexOf('ChunkLoadError') > -1) {
				return {
					default: () => {
						const onClick = () => {
							window.location.reload(true)
						}
						return (
							<div>
								<div>
									服务器版本已更新，目前版本已经落后，请点击下方按钮进行更新
								</div>
								<div onClick={onClick}>更新版本</div>
							</div>
						)
					}
				}
			}

			return {
				default: () => <div>页面拉取出现了异常...</div>
			}
		})
	)
}
