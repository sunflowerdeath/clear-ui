import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import { AnimatedValue, animated, SpringAnimation } from 'react-spring'

import { Layer, Attachment } from '@clear-ui/core'
import withController from '@clear-ui/core/lib/utils/withController'
import { animate, fade } from '@clear-ui/core/lib/animations'

const OPPOSITE_SIDES = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
}

const POSITION_POINTS = {
	begin: { horiz: 'left', vert: 'top' },
	center: { horiz: 'center', vert: 'center' },
	end: { horiz: 'right', vert: 'bottom' }
}

const createAttachmentConfig = (side, align, offset) => {
	/**
	 * 1. point on main axis is defined by `side`
	 *     point on the element - side
	 *     point on the tooltip - opposite of the side
	 * 2. point on second axis is defined by `align`
	 *     begin/center/end of the axis on both element's and target's points
	 */
	const mainAxis = side === 'top' || side === 'bottom' ? 'vert' : 'horiz'
	const secondAxis = mainAxis === 'vert' ? 'horiz' : 'vert'

	const mainAxisPoint = side
	const mainAxisOppositePoint = OPPOSITE_SIDES[side]
	const secondAxisPoint = POSITION_POINTS[align][secondAxis]

	if (mainAxis === 'vert') {
		const signedOffset = side === 'bottom' ? offset : -offset
		return {
			element: `${secondAxisPoint} ${mainAxisOppositePoint}`,
			target: `${secondAxisPoint} ${mainAxisPoint}`,
			offset: `0 ${signedOffset}`
		}
	} else {
		const signedOffset = side === 'right' ? offset : -offset
		return {
			element: `${mainAxisOppositePoint} ${secondAxisPoint}`,
			target: `${mainAxisPoint} ${secondAxisPoint}`,
			offset: `${signedOffset} 0`
		}
	}
}

const DEFAULT_ANIMATION = {
	style: fade,
	config: { tension: 280, friction: 30 },
	impl: SpringAnimation
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
		children: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
			.isRequired,

		/** Content of the tooltip. */
		content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,

		/**
		 * Properties that allow you to control tooltip's open state from the
		 * parent component. If they are not present, tooltip will manage
		 * opened state by itself.
		 */
		isOpen: PropTypes.bool,

		/** Function that is called when tooltip requests to open. */
		onShow: PropTypes.func,

		/** Function that is called when tooltip requests to close. */
		onHide: PropTypes.func,

		/** List of sides where tooltip can be shown in the order of priority. */
		sides: PropTypes.arrayOf(
			PropTypes.oneOf(['top', 'bottom', 'right', 'left'])
		),

		/** Alignment of the tooltip relative to the element's side. */
		align: PropTypes.oneOf(['begin', 'center', 'end']),

		/** Distance between the tooltip and the element, in px. */
		offset: PropTypes.number,

		animation: PropTypes.oneOfType([
			PropTypes.shape({
				style: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
				config: PropTypes.object,
				impl: PropTypes.func
			}),
			PropTypes.bool
		]),

		/** Time before the tooltip starts opening after it is requested, in ms. */
		showDelay: PropTypes.number,

		/** Time before the tooltip starts closing after it is requested, in ms. */
		hideDelay: PropTypes.number
	}

	static defaultProps = {
		sides: ['top', 'right', 'bottom', 'left'],
		align: 'center',
		offset: 10,
		animation: DEFAULT_ANIMATION,
		showDelay: 0,
		hideDelay: 0
	}

	constructor(props) {
		super()
		this.state = { isAttached: props.isOpen }
		this.openValue = new AnimatedValue(props.isOpen ? 1 : 0)
		this.onChangeAttachment = this.onChangeAttachment.bind(this)
		this.show = this.show.bind(this)
		this.hide = this.hide.bind(this)
	}

	componentDidUpdate(prevProps) {
		const { isOpen, animation } = this.props
		if (animation && isOpen !== prevProps.isOpen) {
			this.setState({ isAttached: true })
			const { config, impl } = { ...DEFAULT_ANIMATION, ...animation }
			animate({
				value: this.openValue,
				to: isOpen ? 1 : 0,
				config,
				impl,
				callback: ({ finished }) => {
					if (finished) this.setState({ isAttached: isOpen })
				}
			})
		}
	}

	onChangeAttachment(key) {
		if (this.state.side !== key) this.setState({ side: key })
	}

	getStyle() {
		const { animation } = this.props
		const { computedStyles, vertDirection } = this.state
		return animation
			? {
					...computedStyles.root,
					...(animation.style || DEFAULT_ANIMATION.style)({
						value: this.openValue,
						direction: vertDirection
					})
			  }
			: computedStyles.root
	}

	show() {
		const { showDelay, onShow } = this.props
		if (this.timeout) clearTimeout(this.timeout)
		if (showDelay > 0) this.timeout = setTimeout(onShow, showDelay)
		else onShow()
	}

	hide() {
		const { hideDelay, onHide } = this.props
		if (this.timeout) clearTimeout(this.timeout)
		if (hideDelay > 0) this.timeout = setTimeout(onHide, hideDelay)
		else onHide()
	}

	renderTarget() {
		const { children, isOpen } = this.props
		return typeof children === 'function'
			? children({ isOpen, show: this.show, hide: this.hide })
			: children
	}

	renderElement(ref) {
		const { content, hideDelay } = this.props
		const { side } = this.state
		return (
			<Layer isActive>
				<animated.div
					style={this.getStyle()}
					ref={ref}
					onMouseEnter={() => {
						if (this.timeout) clearTimeout(this.timeout)
					}}
					onMouseLeave={() => {
						if (hideDelay > 0) this.hide()
					}}
				>
					{typeof content === 'function' ? content({ side }) : content}
				</animated.div>
			</Layer>
		)
	}

	render() {
		const { isOpen, animation, sides, align, offset } = this.props
		const { isAttached } = this.state
		const attachments = {}
		sides.forEach(side => {
			attachments[side] = createAttachmentConfig(side, align, offset)
		})
		return (
			<Attachment
				element={ref => this.renderElement(ref)}
				isActive={animation ? isAttached : isOpen}
				onChangeAttachment={this.onChangeAttachment}
				attachments={attachments}
			>
				{this.renderTarget()}
			</Attachment>
		)
	}
}

const createController = UncontrolledTooltip => {
	const TooltipWithController = withController('isOpen', {
		onShow: updateValue => () => updateValue(true),
		onHide: updateValue => () => updateValue(false)
	})(UncontrolledTooltip)
	TooltipWithController.extendStyles = newStyles =>
		createController(
			TooltipWithController.innerComponent.extendStyles(newStyles)
		)
	return TooltipWithController
}

export default createController(floral(styles)(Tooltip))
