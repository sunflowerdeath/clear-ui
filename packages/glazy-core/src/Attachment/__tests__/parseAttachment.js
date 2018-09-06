import assert from 'assert'

import parseAttachment from '../parseAttachmentConfig'

describe('attachment/parseAttachmentConfig', () => {
	it('parses attachment config', () => {
		const att = {
			element: '10px 20%',
			target: 'right top '
		}
		const parsed = parseAttachment(att)
		assert.deepEqual(parsed, {
			element: {
				horiz: { value: 10, unit: 'px' },
				vert: { value: 20, unit: '%' }
			},
			target: {
				horiz: { value: 100, unit: '%' },
				vert: { value: 0, unit: '%' }
			}
		})
	})

	it('throws if position has invalid unit', () => {
		const att = {
			element: '0inv 0px',
			target: '0px 0px'
		}
		let thrown
		try {
			parseAttachment(att)
		} catch (err) {
			thrown = true
			assert(err.message.indexOf('not valid unit') !== -1)
		}
		assert(thrown)
	})

	it('throws if invalid special value is provided', () => {
		const att = {
			element: 'invalid 0px',
			target: '0px 0px'
		}
		let thrown
		try {
			parseAttachment(att)
		} catch (err) {
			thrown = true
			assert(err.message.indexOf('not valid special value') !== -1)
		}
		assert(thrown)
	})
})
