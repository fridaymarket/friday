const inMicroservice = (): boolean => {
	return !!(window as any).__POWERED_BY_QIANKUN__
}

export default inMicroservice
