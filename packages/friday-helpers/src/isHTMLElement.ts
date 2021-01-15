export const isHTMLElement = (node: any) => {
	return typeof node === 'object' && node !== null && node.nodeType && node.nodeName
}
