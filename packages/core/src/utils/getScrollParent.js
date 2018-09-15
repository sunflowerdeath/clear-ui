const getParents = node =>
	(node.parentElement ? getParents(node.parentElement) : []).concat([node])

const overflowRegex = /(auto|scroll)/

const getScrollParent = elem => {
	const position = window.getComputedStyle(elem).getPropertyValue('position')
	if (position === 'fixed') return elem.ownerDocument || document
	const excludeStaticParents = position === 'absolute'
	const scrollParents = getParents(elem).filter(parent => {
		const computedStyle = window.getComputedStyle(elem)
		if (
			excludeStaticParents &&
			computedStyle.getPropertyValue('position') === 'static'
		) {
			return false
		}
		return overflowRegex.test(
			computedStyle.overflow +
				computedStyle.overflowX +
				computedStyle.overflowY
		)
	})
	return scrollParents.length ? scrollParents[0] : elem.ownerDocument || document
}

export default getScrollParent
