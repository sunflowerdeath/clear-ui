import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import floral from 'floral'
import { AnimatedValue, animated, SpringAnimation } from 'react-spring'

import { Layer, Overlay, Attachment } from '@clear-ui/core'
import { animate, fade } from '@clear-ui/core/lib/animations'
import withController from '@clear-ui/core/lib/utils/withController'

const OPPOSITE_SIDES = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
}

const DEFAULT_ANIMATION = {
	style: fade,
	config: { tension: 280, friction: 30 },
	impl: SpringAnimation
}

const styles = ({ isOpen }) => ({
	root: {
		position: 'absolute',
		boxSizing: 'border-box',
		pointerEvents: isOpen ? 'auto' : 'none'
	}
})

class Dropdown extends Component {
	static propTypes = {
		/** Trigger of the dropdown. Single React-element. */
		trigger: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,

		/**
		 * Properties that allow you to control dropdowns's open state from
		 * the parent component. If they are not present, dropdown will control
		 * opened state by intself.
		 */
		isOpen: PropTypes.bool,

		/**
		 * Functions that is called when dropdown requests to change its opened
		 * state, when it is controlled, i.e. prop `open` is defined.
		 * `(isOpen: bool) => void`
		 */
		onOpen: PropTypes.func,
		onClose: PropTypes.func,

		animation: PropTypes.oneOfType([
			PropTypes.shape({
				style: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
				config: PropTypes.object,
				impl: PropTypes.func
			}),
			PropTypes.bool
		]),

		/**
		 * Horizontal side where the dropdown expands when it is wider than
		 * the trigger element.
		 */
		expandSide: PropTypes.oneOf(['left', 'right']),

		/** Vertical side where the dropdown shows if there is enough space. */
		vertSide: PropTypes.oneOf(['top', 'bottom']),

		/** Distance between the trigger and the dropdown. */
		vertOffset: PropTypes.number,

		horizOffset: PropTypes.number,

		constrain: PropTypes.bool,

		viewportPadding: PropTypes.number,

		/** Maximum height of the list, in px. */
		maxHeight: PropTypes.number
	}

	static defaultProps = {
		expandSide: 'right',
		vertSide: 'bottom',
		vertOffset: 0,
		horizOffset: 0,
		constrain: false,
		viewportPadding: 10,
		maxHeight: Infinity,
		animation: DEFAULT_ANIMATION
	}

	constructor(props) {
		super()
		this.state = { isAttached: props.isOpen }
		this.openValue = new AnimatedValue(props.isOpen ? 1 : 0)
		this.onChangeAttachment = this.onChangeAttachment.bind(this)
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

	onChangeAttachment(key, mirror) {
		const { vertSide, expandSide } = this.props
		this.setState({
			vertDirection: mirror.vert ? OPPOSITE_SIDES[vertSide] : vertSide,
			horizDirection: mirror.horiz ? OPPOSITE_SIDES[expandSide] : expandSide
		})
	}

	getAttachmentConfig() {
		const {
			expandSide,
			vertSide,
			vertOffset,
			horizOffset,
			constrain,
			viewportPadding
		} = this.props
		const oppositeSide = OPPOSITE_SIDES[expandSide]
		const oppositeVertSide = OPPOSITE_SIDES[vertSide]
		return {
			attachments: {
				default: {
					target: `${oppositeSide} ${vertSide}`,
					element: `${oppositeSide} ${oppositeVertSide}`,
					offset: `${horizOffset}px ${vertOffset}px`
				}
			},
			mirrorAttachment: 'all',
			constrain,
			viewportPadding
		}
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

	setSizes(dropdownRef) {
		const { maxHeight, viewportPadding } = this.props
		const triggerElem = ReactDOM.findDOMNode(this.triggerRef)
		const dropdownElem = ReactDOM.findDOMNode(dropdownRef)
		dropdownElem.style.minWidth = `${triggerElem.offsetWidth}px`
		dropdownElem.style.maxHeight =
			Math.min(
				document.querySelector('html').offsetHeight - 2 * viewportPadding,
				maxHeight
			) + 'px'
	}

	renderElement(ref) {
		const { isOpen, onClose, children, animation } = this.props
		const { computedStyles, vertDirection } = this.state
		const overlay = isOpen && (
			<Overlay closeOnEsc closeOnClick onClose={onClose} />
		)
		return (
			<Layer isActive>
				{overlay}
				<animated.div
					ref={dropdownRef => {
						if (dropdownRef) this.setSizes(dropdownRef)
						ref(dropdownRef)
					}}
					style={this.getStyle()}
				>
					{children}
				</animated.div>
			</Layer>
		)
	}

	renderTrigger() {
		const { isOpen, onOpen, onClose, trigger } = this.props
		const toggle = () => (isOpen ? onClose() : onOpen())
		const elem =
			typeof trigger === 'function'
				? trigger(toggle)
				: React.cloneElement(trigger, { onClick: toggle })
		return React.cloneElement(elem, {
			ref: ref => {
				this.triggerRef = ref
			}
		})
	}

	render() {
		const { isOpen, animation } = this.props
		const { isAttached } = this.state
		const config = this.getAttachmentConfig()
		return (
			<Attachment
				element={ref => this.renderElement(ref)}
				isActive={animation ? isAttached : isOpen}
				onChangeAttachment={this.onChangeAttachment}
				{...config}
			>
				{this.renderTrigger()}
			</Attachment>
		)
	}
}

const createController = UncontrolledDropdown => {
	const DropdownWithController = withController('isOpen', {
		onOpen: updateValue => () => updateValue(true),
		onClose: updateValue => () => updateValue(false)
	})(UncontrolledDropdown)
	DropdownWithController.extendStyles = newStyles =>
		createController(
			DropdownWithController.innerComponent.extendStyles(newStyles)
		)
	return DropdownWithController
}

export default createController(floral(styles)(Dropdown))
