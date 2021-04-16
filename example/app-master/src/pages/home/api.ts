import { createGetApi, createPostApi } from 'friday-async'

export default class Apis {
	getTest = createGetApi<any, {
		test: number
		ss: 222

	}>({ url: '/test' })
	getPost = createPostApi({ url: '/test_post' })
}
