export const httpDownload = (response, name) => {
	const blob = new Blob([response], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
	})
	const aEle = document.createElement('a')
	const href = window.URL.createObjectURL(blob)
	aEle.href = href
	aEle.download = name
	document.body.appendChild(aEle)
	aEle.click()
	document.body.removeChild(aEle)
	window.URL.revokeObjectURL(href)
	// return {
	// 	data: response
	// } as any
}

export const elementDownload = (url, name) => {
	var link = document.createElement('a')
	link.setAttribute('download', name)
	link.href = url
	document.body.appendChild(link)
	link.click()
	link.remove()
}
