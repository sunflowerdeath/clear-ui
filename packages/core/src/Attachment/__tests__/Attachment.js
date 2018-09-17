import assert from 'assert'

import Attachment from '../Attachment.js'

describe('attachment', () => {
	let attachment

	const winHeight = window.innerHeight
	const body = document.querySelector('body')
	const html = document.querySelector('html')
	body.style.margin = '0'

	// Place target at the top of viewport
	const TARGET_STYLE = {
		position: 'absolute',
		width: '100px',
		height: `${Math.round(winHeight * 0.2)}px`,
		left: 0,
		top: `${winHeight}px`,
		background: '#ccc'
	}

	const ELEMENT_STYLE = {
		position: 'absolute',
		width: '100px',
		height: `${Math.round(winHeight * 0.5)}px`,
		background: '#ddd'
	}

	const TARGET = document.createElement('div')
	const ELEMENT = document.createElement('div')

	beforeEach(() => {
		// Set html height to x2 of the window height
		// Scroll down by window height
		html.style.height = `${winHeight * 2}px`
		html.scrollTop = winHeight
		Object.assign(TARGET.style, TARGET_STYLE)
		Object.assign(ELEMENT.style, ELEMENT_STYLE)
		body.appendChild(TARGET)
		body.appendChild(ELEMENT)
	})

	afterEach(() => {
		body.removeChild(TARGET)
		body.removeChild(ELEMENT)
		if (attachment) attachment.destroy()
		html.style.height = ''
	})

	// Does not fit
	const TOP_ATTACHMENT = {
		target: 'center top',
		element: 'center bottom'
	}

	// Fits
	const BOTTOM_ATTACHMENT = {
		target: 'center bottom',
		element: 'center top'
	}

	const getElemPosition = elem => {
		const bodyRect = body.getBoundingClientRect()
		const elemRect = elem.getBoundingClientRect()
		return {
			top: elemRect.top - bodyRect.top,
			left: elemRect.left - bodyRect.left
		}
	}

	it('attaches element', () => {
		attachment = new Attachment({
			element: ELEMENT,
			target: TARGET,
			attachments: { top: TOP_ATTACHMENT, bottom: BOTTOM_ATTACHMENT }
		})

		const elemPos = getElemPosition(ELEMENT)
		const targetPos = getElemPosition(TARGET)
		assert.equal(elemPos.top, targetPos.top + TARGET.offsetHeight)
		assert.equal(ELEMENT.offsetLeft, 0)
	})

	it('mirrors attachment when it does not fits', () => {
		attachment = new Attachment({
			element: ELEMENT,
			target: TARGET,
			attachments: { top: TOP_ATTACHMENT },
			mirrorAttachment: 'vert'
		})

		const targetPos = getElemPosition(TARGET)
		const elemPos = getElemPosition(ELEMENT)
		assert.equal(elemPos.top, targetPos.top + TARGET.offsetHeight)
	})

	it('constrains element when it does not fits viewport', () => {
		const VIEWPORT_PADDING = 20

		attachment = new Attachment({
			element: ELEMENT,
			target: TARGET,
			attachments: { top: TOP_ATTACHMENT },
			constrain: true,
			viewportPadding: VIEWPORT_PADDING
		})

		const elemPos = getElemPosition(ELEMENT)
		assert.equal(elemPos.top, html.scrollTop + VIEWPORT_PADDING)
	})

	it('updatePosition() updates position', () => {
		attachment = new Attachment({
			element: ELEMENT,
			target: TARGET,
			attachments: { top: TOP_ATTACHMENT, bottom: BOTTOM_ATTACHMENT }
		})
		assert.equal(getElemPosition(ELEMENT).left, 0)

		// Move target
		TARGET.style.left = '5px'
		attachment.updatePosition()
		assert.equal(getElemPosition(ELEMENT).left, 5)
	})

	it('updates on scroll and resize', () => {
		attachment = new Attachment({
			element: ELEMENT,
			target: TARGET,
			attachments: { top: TOP_ATTACHMENT, bottom: BOTTOM_ATTACHMENT }
		})
		assert.equal(getElemPosition(ELEMENT).left, 0)

		TARGET.style.left = '5px' // Move target
		window.dispatchEvent(new Event('scroll'))
		assert.equal(getElemPosition(ELEMENT).left, 5)

		TARGET.style.left = '3px' // Move target
		window.dispatchEvent(new Event('resize'))
		assert.equal(getElemPosition(ELEMENT).left, 3)
	})
})
