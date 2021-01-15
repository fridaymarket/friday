import { isObject } from './isObject'

export const effectiveObject = (target) => {
	if (!isObject(target)) return false
	if (Object.keys(target).length === 0) return false
	return true
}
