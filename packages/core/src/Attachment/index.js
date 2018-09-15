import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import pick from 'lodash.pick'

import cloneElementWithRef from '../utils/cloneElementWithRef'

import AttachmentClass from './Attachment'

/**
 * Attaches element to target.
 */
class Attachment extends Component {
	static propTypes = {
		/** Attachment target. */
		children: PropTypes.element.isRequired,

		/** Attached element. */
		element: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,

		/** Controls the visibility of the attached element. */
		isActive: PropTypes.bool,

		/**
		 * Configuration of attachment points or a list of possible configs.
		 * Component will choose an attachment that allows element to fit to
		 * the viewport.
		 *
		 * Format of the config object is following:
		 *
		 * - **element** `string` – Attachment point of the element.
		 *     String of the form of `vert-attachment horiz-attachment`.
		 *     Attachment value is a number with `px` or `%`.
		 *     Also it supports special values, `vert-attachment` can be
		 *     `'top'`, `'middle'`, `'bottom'`, and `horiz-attachment` can be
		 *     `'left'`, `'right'` and `'center'`.
		 *
		 * - **target** `string` – Attachment point of the target element.
		 *     Format is same as for element.
		 *
		 * - **offset** `string` _optional_ – Offset of the element.
		 *     Format is same as for element and target, but without special values.
		 */
		attachment: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
			.isRequired,

		/**
		 * Axis of attachment that can be mirrored to fit element to the viewport.
		 * It is used when single attachment used.
		 * Default is `'none'`.
		 */
		mirrorAttachment: PropTypes.oneOf(['all', 'vert', 'horiz', 'none']),

		/** Minimal distance from element to the viewport bound. Default is 0. */
		viewportPadding: PropTypes.number,

		/**
		 * When none of attachments allows element to fully fit on the screen,
		 * element is fixed near the edge of the screen.
		 */
		constrain: PropTypes.bool,

		/**
		 * Function that is called when component chooses another attachment or
		 * mirrors it to fit attached element on the screen.
		 *
		 * `(index: number, mirrored: object) => void`
		 * - **index** – Index of the chosen attachment config.
		 * - **mirror** – Object with keys `horiz` and `vert` that are `true` when
		 *      attachment is mirrored on that axis.
		 */
		onChangeAttachment: PropTypes.func
	}

	componentDidUpdate() {
		if (!this.props.isActive) this.destroyAttachment()
	}

	componentWillUnmount() {
		this.destroyAttachment()
	}

	setAttachment() {
		const options = pick(
			this.props,
			'attachment',
			'viewportPadding',
			'constrain',
			'mirrorAttachment',
			'onChangeAttachment'
		)
		Object.assign(options, {
			element: ReactDOM.findDOMNode(this.elementRef),
			target: ReactDOM.findDOMNode(this.targetRef)
		})

		if (this.attachment) {
			this.attachment.updateOptions(options)
			// TODO compare options & prev options to only updatePosition
		} else {
			this.attachment = new AttachmentClass(options)
		}
	}

	destroyAttachment() {
		if (this.attachment) {
			this.attachment.destroy()
			this.attachment = undefined
		}
	}

	render() {
		const { element, children, isActive } = this.props

		let result
		if (isActive) {
			const elementRef = ref => {
				this.elementRef = ref
				if (this.elementRef !== null) this.setAttachment()
			}
			result =
				typeof element === 'function'
					? element(elementRef)
					: cloneElementWithRef(element, { ref: elementRef })
		}

		const target = cloneElementWithRef(children, {
			ref: ref => {
				this.targetRef = ref
			}
		})

		return (
			<Fragment>
				{target}
				{result}
			</Fragment>
		)
	}
}

export default Attachment
