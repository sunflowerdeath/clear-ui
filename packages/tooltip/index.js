import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import { AnimatedValue, controller, animated, SpringAnimation } from 'react-spring'

import withController from '../utils/withController'
import animate from '../utils/animate'
import { fade } from '../utils/animations'
import { Layer } from '../Layers'
import Attachment from '../Attachment/AttachmentComponent'

const OPPOSITE_SIDES = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
}

const POSITION_POINTS = {
	begin: {horiz: 'left', vert: 'top'},
	center: {horiz: 'center', vert: 'middle'},
	end: {horiz: 'right', vert: 'bottom'}
}

const createAttachmentConfig = (side, align, offset) => {
	/**
	 * 1. point on main axis is defined by `side`
	 *     point on the element - side
	 *     point on the tooltip - opposite of the side
	 * 2. point on second axis is defined by `align`
	 *     begin/center/end of the axis on both element's and target's points
	 */
	const mainAxis = (side === 'top' || side === 'bottom') ? 'vert' : 'horiz'
	const secondAxis = (mainAxis === 'vert') ? 'horiz' : 'vert'

	const mainAxisPoint = side
	const mainAxisOppositePoint = OPPOSITE_SIDES[side]
	const secondAxisPoint = POSITION_POINTS[align][secondAxis]

	if (mainAxis === 'vert') {
		const signedOffset = (side === 'bottom') ? offset : -offset
		return {
			element: `${secondAxisPoint} ${mainAxisOppositePoint}`,
			target: `${secondAxisPoint} ${mainAxisPoint}`,
			offset: `0 ${signedOffset}`
		}
	} else {
		const signedOffset = (side === 'right') ? offset : -offset
		return {
			element: `${mainAxisOppositePoint} ${secondAxisPoint}`,
			target: `${mainAxisPoint} ${secondAxisPoint}`,
			offset: `${signedOffset} 0`
		}
	}
}

const styles = {
	root: {
		position: 'absolute'
	}
}

class Tooltip extends Component {
	static displayName = 'Tooltip'

	static propTypes = {
		/** Element to which the tooltip is attached. */
		children: PropTypes.element.isRequired,

		/** Content of the tooltip. */
		tooltip: PropTypes.node.isRequired,

		/**
		 * Properties that allow you to control tooltip's open state from the 
		 * parent component. If they are not present, tooltip will manage 
		 * opened state by itself.
		 */
		isOpen: PropTypes.bool,

		/** Function that is called when tooltip requests to open. */
		onOpen: PropTypes.func,

		/** Function that is called when tooltip requests to close. */
		onClose: PropTypes.func,

		/** List of sides where tooltip can be shown in the order of priority. */
		sides: PropTypes.arrayOf(
			PropTypes.oneOf(['top', 'bottom', 'right', 'left'])
		),

		/** Alignment of the tooltip relative to the element's side. */
		align: PropTypes.oneOf(['begin', 'center', 'end']),

		/** TODO */
		arrow: PropTypes.bool,

		/** Distance between the tooltip and the element, in px. */
		offset: PropTypes.number,

		animation: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
		animationConfig: PropTypes.object,
		animationImpl: PropTypes.func,

		/** Time before the tooltip starts opening after it is requested, in ms. */
		openTimeout: PropTypes.number,

		/** Time before the tooltip starts closing after it is requested, in ms. */
		closeTimeout: PropTypes.number
	}

	static defaultProps = {
		sides: ['top', 'right', 'bottom', 'left'],
		align: 'center',
		offset: 10,
		animation: fade,
		animationConfig: { tension: 210, friction: 20 },
		animationImpl: SpringAnimation,
		openTimeout: 0,
		closeTimeout: 0
	}

	constructor(props) {
		super()
		this.state = { isAttached: props.isOpen }
		this.openValue = new AnimatedValue(props.isOpen ? 1 : 0)
	}

	renderTarget(ref) {
		const { children, isOpen, onShow, onHide } = this.props
		return typeof children === 'function
			? children({ isOpen, onShow, onHide })
			: children
	}

	renderElement(ref) {
		const { content } = this.props
		return (
			<Layer isActive={true}>
				<div style={computedStyles.root}>{content}</div>
			</Layer>
		)
	}

	render() {
		const { isOpen, animation } = this.props
		const { isAttached } = this.state
		return (
			<Attachment
				element={ref => this.renderElement(ref)}
				isActive={animation ? isAttached : isOpen}
				onChangeAttachment={this.onChangeAttachment.bind(this)}
				{...config}
			>
				{this.renderTarget()}
			</Attachment>
		)
	}
}

const createController = Tooltip => {
	const TooltipWithController = withController('isOpen', {
		onOpen: updateValue => () => updateValue(true),
		onClose: updateValue => () => updateValue(false)
	})(Tooltip)
	TooltipWithController.extendStyles = styles =>
		createController(TooltipWithController.innerComponent.extendStyles(styles))
	return TooltipWithController
}

export default createController(floral(styles)(Tooltip))
