const {
	override,
	addWebpackAlias,
	addWebpackResolve,
	disableEsLint,
	setWebpackOptimizationSplitChunks,
	overrideDevServer,
	addLessLoader,
	fixBabelImports,
	addWebpackPlugin
} = require('customize-cra')

const {
	devServerCorsOrHeader,
	OverrideMicroOutPut,
	addEntryAttribute
} = require('friday-micro-webpack-plugin')

const path = require('path')

const packageName = require('./package.json').name

module.exports = {
	webpack: override(
		// 禁止eslint
		disableEsLint(),
		// 抽出公共模块
		setWebpackOptimizationSplitChunks({
			chunks: 'all',
			cacheGroups: {
				vendor: {
					// 使用正则匹配所有加载路径为 node_modules 路径下的模块
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor'
				}
			}
		}),
		// 别名添加， tsconfig.json也需要添加该别名。
		addWebpackAlias({
			src: path.resolve(__dirname, './src')
		}),
		// 忽略后缀
		addWebpackResolve({
			extensions: ['.ts', '.tsx', '.js', 'less']
		}),
		// 按需加载
		fixBabelImports('import', {
			libraryName: 'antd',
			libraryDirectory: 'es',
			style: true
		}),
		// 按需加载
		fixBabelImports('lodash', {
			libraryDirectory: '',
			camel2DashComponentName: false
		}),
		// less lader
		addLessLoader({
			javascriptEnabled: true
		}),
		// 微服务暴露出口
		OverrideMicroOutPut(packageName),
		// 微服务标记出口文件
		addWebpackPlugin(addEntryAttribute())
	),
	devServer: overrideDevServer(
		// 添加cors
		devServerCorsOrHeader()
	)
}
