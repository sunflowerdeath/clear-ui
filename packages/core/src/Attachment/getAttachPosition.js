const calcCoord = (value, size, mirror) => {
	let coord = value.unit === '%' ? (size * value.value) / 100 : value.value
	if (mirror) coord = size - coord
	return coord
}

const calcPosition = (measurements, attachment, mirror) => {
	const { element: e, target: t } = measurements

	const hElemCoord = calcCoord(attachment.element.horiz, e.width, mirror.horiz)
	const hTargetCoord = calcCoord(attachment.target.horiz, t.width, mirror.horiz)
	let hOffsetCoord = attachment.offset
		? calcCoord(attachment.offset.horiz, e.width)
		: 0
	if (mirror.horiz) hOffsetCoord = -hOffsetCoord
	const hCoord = t.offset.left + hTargetCoord + hOffsetCoord - hElemCoord

	const vElemCoord = calcCoord(attachment.element.vert, e.height, mirror.vert)
	const vTargetCoord = calcCoord(attachment.target.vert, t.height, mirror.vert)
	let vOffsetCoord = attachment.offset
		? calcCoord(attachment.offset.vert, e.height)
		: 0
	if (mirror.vert) vOffsetCoord = -vOffsetCoord
	const vCoord = t.offset.top + vTargetCoord + vOffsetCoord - vElemCoord

	return { left: Math.round(hCoord), top: Math.round(vCoord) }
}

const checkFitViewport = (pos, m /* measurements */, padding) =>
	pos.left >= m.bounds.left + padding &&
	pos.left + m.element.width <= m.bounds.right - padding &&
	pos.top >= m.bounds.top + padding &&
	pos.top + m.element.height <= m.bounds.bottom - padding

const constrainPosition = (pos, m /* measurements */, padding) => {
	const res = { ...pos }
	if (res.left < m.bounds.left + padding) res.left = m.bounds.left + padding
	if (res.top < m.bounds.top + padding) res.top = m.bounds.top + padding
	if (res.left + m.element.width > m.bounds.right - padding) {
		res.left = m.bounds.right - m.element.width - padding
	}
	if (res.top + m.element.height > m.bounds.bottom - padding) {
		res.top = m.bounds.bottom - m.element.height - padding
	}
	return res
}

const getMirrorsList = mirror => {
	const mirrors = [{ vert: false, horiz: false }]
	if (mirror === 'vert' || mirror === 'all') {
		mirrors.push({ vert: true, horiz: false })
	}
	if (mirror === 'horiz' || mirror === 'all') {
		mirrors.push({ vert: false, horiz: true })
	}
	if (mirror === 'all') mirrors.push({ vert: true, horiz: true })
	return mirrors
}

/**
 * Finds attachment when the element fits in the viewport and
 * returns position of the attached element.
 * @return {[pos: object, index: number, {horiz: boolean, vert: boolean}]}
 *     Array with 3 elements.
 *     First is position object, second is index of the chosen attachment config,
 *     third is mirrored state of the attachment.
 */
const getAttachPosition = ({
	measurements,
	attachments,
	constrain,
	viewportPadding,
	mirrorAttachment
}) => {
	const mirrorsList = getMirrorsList(mirrorAttachment)
	let pos, key, mirror
	/* eslint-disable no-restricted-syntax, no-labels */
	outer: for (key in attachments) {
		const att = attachments[key]
		for (const i in mirrorsList) {
			mirror = mirrorsList[i]
			pos = calcPosition(measurements, att, mirror)
			if (checkFitViewport(pos, measurements, viewportPadding)) break outer
		}
	}
	/* eslint-enable no-restricted-syntax, no-labels */
	if (constrain && pos) {
		pos = constrainPosition(pos, measurements, viewportPadding)
	}
	return [pos, key, mirror]
}

export default getAttachPosition
