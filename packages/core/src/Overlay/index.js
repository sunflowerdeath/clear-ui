import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'

const styles = {
	root: {
		position: 'fixed',
		width: '100%',
		height: '100%'
	}
}

const Overlay = floral(styles)(
	({ children, closeOnEsc, closeOnClick, onClose, computedStyles }) => (
		<div style={computedStyles.root} onClick={closeOnClick && onClose} />
	)
)

Overlay.propTypes = {
	closeOnEsc: PropTypes.bool,
	cloneOnClick: PropTypes.bool
}

export default Overlay
