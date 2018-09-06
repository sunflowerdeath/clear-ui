import isEqual from 'lodash.isequal'

import getScrollParent from '../utils/getScrollParent.js'

import parseAttachmentConfig from './parseAttachmentConfig'
import readMeasurements from './readMeasurements'
import getAttachPosition from './getAttachPosition'

/**
 * @type AttachmentConfig
 * Description of how the attached element should be positioned relatively
 * to the target element. It has two points, one on the attached element and
 * second on the target element, that will be connected together, and an offset.
 * @param {string} element - Attachment point of the element.
 *		 String of the form of 'vert-attachment horiz-attachment'.
 *		 Attachment value is a number with 'px' or '%'.
 *		 Also, 'vert-attachment' can be: 'top', 'middle' and 'bottom',
 *		 and 'horiz-attachment' can be 'left', 'right' and 'center'.
 * @param {string} target - Attachment point of the target element.
 *		 Format is same as for 'element'.
 * @param {string} [offset] - Offset of the element. Format is same as for
 *		 'element' and 'target', but without special values.
 */

/**
 * @type AttachmentOptions
 * @param {Element} element - Attached element
 * @param {Element} target - Attachment target
 * @param {AttachmentConfig|Array<AttachmentConfig>} attachment -
 *     Configuration of attachment points or a list of possible configs.
 *     Component will choose an attachment that allows element to fit in
 *     the viewport.
 * @param {'all'|'vert'|'horiz'|'none'} [mirrorAttachment='none'] -
 *     Axis of attachment that can be mirrored to fit element to the viewport.
 *     It is used when single attachment used. FIXME why not always?
 * @param {number} [viewportPadding=0] -
 *     Minimal distance from element to the viewport bound.
 * @param {boolean} [constrain] - TODO
 * @param {function(index: number, mirror: AttachmentMirrorAxis)}
 *     [onChangeAttachment] - TODO
 */

const DEFAULT_OPTIONS = {
	constrain: false,
	mirrorAttachment: 'none',
	viewportPadding: 0
}

/**
 * It makes element stay next to another element, connecting two attachment
 * points on the elements.
 * @param options {AttachmentOptions}
 */
class Attachment {
	constructor(options) {
		this.updateOptions(options)
		Attachment.addInstance(this)
	}

	processOptions(options) {
		const { element, target, attachment, ...rest } = options

		let parsedAttachments
		if (attachment) {
			if (Array.isArray(attachment) && !attachment.length) {
				throw new Error('"options.attachment" must not be empty')
			}
			parsedAttachments = this.parseAttachments(attachment)
		} else {
			throw new Error('"options.attachment" is required')
		}

		return {
			...DEFAULT_OPTIONS,
			element,
			target,
			parsedAttachments,
			...rest
		}
	}

	/** TODO */
	updateOptions(options) {
		this.options = this.processOptions(options)
		this.updatePosition()
	}

	parseAttachments(attachment) {
		return Array.isArray(attachment)
			? attachment.map(parseAttachmentConfig)
			: [parseAttachmentConfig(attachment)]
	}

	/** @public TODO */
	updatePosition() {
		const {
			parsedAttachments,
			constrain,
			viewportPadding,
			mirrorAttachment,
			element,
			target,
			onChangeAttachment
		} = this.options
		const measurements = readMeasurements(element, target)
		const [position, index, mirror] = getAttachPosition({
			measurements,
			constrain,
			viewportPadding,
			mirrorAttachment,
			attachments: parsedAttachments
		})
		if (position) this.setPosition(position)
		if (this.prevAttachmentIndex !== index || isEqual(this.prevMirror, mirror)) {
			if (onChangeAttachment) onChangeAttachment(index, mirror)
			this.prevAttachmentIndex = index
			this.prevMirror = mirror
		}
	}

	setPosition(position) {
		const { left, top } = position
		const { element } = this.options

		const useTranslate = true
		if (useTranslate) {
			element.style.transform = `translate(${left}px, ${top}px)`
		} else {
			element.style.left = `${left}px`
			element.style.top = `${top}px`
		}
	}

	bindHandlers() {
		this.scrollParent = getScrollParent(this.options.target)
		if (this.scrollParent[0] !== document) {
			this.listener = this.updatePosition.bind(this)
			this.scrollParent.addEventListener('scroll', this.listener)
		}
	}

	unbindHandlers() {
		if (this.listener) {
			this.scrollParent.removeEventListener('scroll', this.listener)
		}
	}

	destroy() {
		Attachment.removeInstance(this)
	}

	static updatedInstances = new Set()

	static updatePosition() {
		this.updatedInstances.forEach(item => item.updatePosition())
	}

	static addInstance(inst) {
		if (this.updatedInstances.size === 0) this.bindHandlers()
		this.updatedInstances.add(inst)
		inst.bindHandlers()
	}

	static removeInstance(inst) {
		this.updatedInstances.delete(inst)
		if (this.updatedInstances.size === 0) this.unbindHandlers()
		inst.unbindHandlers()
	}

	static bindHandlers() {
		this.listener = this.updatePosition.bind(this)
		window.addEventListener('scroll', this.listener)
		window.addEventListener('resize', this.listener)
	}

	static unbindHandlers() {
		window.removeEventListener('scroll', this.listener)
		window.removeEventListener('resize', this.listener)
	}
}

export default Attachment
