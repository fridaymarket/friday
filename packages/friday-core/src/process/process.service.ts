import { Deferred } from './deferred'
import { IDeferredSerivce } from './process'

/**
 * 注入模块的状态控制器
 * _deferred 作为是否注入完成的判断条件
 */
export default abstract class DeferredSerivce implements IDeferredSerivce {
	private _deferred!: Deferred<void>

	public get deferred() {
		return this._deferred
	}

	protected inject_finally() {
		this._deferred = new Deferred()
	}
}
