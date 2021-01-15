type ResolveFuns<T> = (value?: T | PromiseLike<T>) => void

export class Deferred<T> {
	promise: Promise<T>

	resolve!: ResolveFuns<T>

	reject!: (reason?: any) => void

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve as ResolveFuns<T>
			this.reject = reject
		})
	}
}
