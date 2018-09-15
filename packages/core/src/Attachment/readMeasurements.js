const documentElement = document.documentElement

const readElemMeasurements = (elem, viewport) => {
	const rect = elem.getBoundingClientRect()
	return {
		offset: {
			left: rect.left + viewport.scrollLeft,
			top: rect.top + viewport.scrollTop
		},
		// offset measures before scale
		width: elem.offsetWidth,
		height: elem.offsetHeight
	}
}

const readViewportMeasurements = () => {
	const html = document.querySelector('html')
	return {
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX#Notes
		scrollTop: window.pageYOffset,
		scrollLeft: window.pageXOffset,
		// this is without scrollbars
		height: html.offsetHeight,
		width: html.offsetWidth
	}
}

const getViewportBounds = viewport => ({
	left: viewport.scrollLeft,
	right: viewport.scrollLeft + viewport.width,
	top: viewport.scrollTop,
	bottom: viewport.scrollTop + viewport.height
})

const readMeasurements = (element, target) => {
	const viewport = readViewportMeasurements()
	return {
		viewport,
		bounds: getViewportBounds(viewport),
		element: readElemMeasurements(element, viewport),
		target: readElemMeasurements(target, viewport)
	}
}

export default readMeasurements
