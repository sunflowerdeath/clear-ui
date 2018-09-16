import React from 'react'
import floral from 'floral'

/**
 * Makes styles for positioning arrow of the tooltip.
 * @param {object} options
 * @param {'top'|'bottom'|'left'|'rigth'} options.side - Side of the tooltip.
 * @param {'begin'|'center'|'end'} options.align - Align of the arrow on the tooltip's side.
 * @param {number} options.width - Width of the arrow, for the orientation like this: "/\".
 * @param {number} options.height - Height of the arrow.
 * @param {number} options.margin - Margin between arrow and tooltip's corner.
 * @param {string} options.units - CSS-unit for arrow sizes.
 */
const styles = ({ side, align, width, height, margin, unit }) => {
	const orientation = side === 'top' || side === 'bottom' ? 'horiz' : 'vert'

	const root = {
		position: 'absolute'
	}

	// position on the axis across side with the arrow
	const pos = -height + unit
	if (side === 'top') root.bottom = pos
	else if (side === 'bottom') root.top = pos
	else if (side === 'left') root.right = pos
	else if (side === 'right') root.left = pos

	// position on the axis along side with the arrow
	if (orientation === 'horiz') {
		root.width = width + unit
		root.height = height + unit

		if (align === 'begin') {
			root.left = margin + unit
		} else if (align === 'center') {
			root.left = '50%'
			root.marginLeft = -width / 2 + unit
		} else if (align === 'end') {
			root.left = '100%'
			root.marginLeft = -margin - width + unit
		}
	} else if (orientation === 'vert') {
		root.width = height + unit
		root.height = width + unit

		if (align === 'begin') {
			root.top = margin + unit
		} else if (align === 'center') {
			root.top = '50%'
			root.marginTop = -width / 2 + unit
		} else if (align === 'end') {
			root.top = '100%'
			root.marginTop = -margin - width + unit
		}
	}

	return { root }
}

const TooltipArrow = ({ computedStyles }) => <div style={computedStyles.root} />

export default floral(styles)(TooltipArrow)
