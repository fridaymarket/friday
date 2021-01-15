type ResolveFun<T> = (value?: T | PromiseLike<T>) => void
export class Deferred<T> {
	promise: Promise<T>

	resolve!: ResolveFun<T>

	reject!: (reason?: any) => void

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve as ResolveFun<T>
			this.reject = reject
		})
	}
}
