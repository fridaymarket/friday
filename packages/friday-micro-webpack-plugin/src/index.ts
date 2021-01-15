/**
 * 重写webpack dev server requset header
 * 默认添加cors
 * @param headers  request header
 */

const defaultHeaders = {
	'Access-Control-Allow-Origin': '*'
}

export const devServerCorsOrHeader = (headers = defaultHeaders) => (config) => {
	return {
		...config,
		headers
	}
}

/**
 * 重写output，支持微服务slave暴露生命周期方法入口
 * @param packageName
 */
export const OverrideMicroOutPut = (packageName) => (config) => {
	config.output.library = `${packageName}-[name]`
	config.output.libraryTarget = 'umd'
	config.output.jsonpFunction = `webpackJsonp_${packageName}`
	return config
}

const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

/**
 * 给webpack生成的js添加entry属性，目的为了让微服务知道哪个js是入口
 * @param test
 */
export const addEntryAttribute = (test?) => {
	const realTest = test ? test : /main.chunk\.js$/

	return new ScriptExtHtmlWebpackPlugin({
		custom: {
			test: realTest,
			attribute: 'entry'
		}
	})
}
