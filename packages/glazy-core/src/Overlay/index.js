import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'

const styles = { position: 'fixed', background: 'rgba(0,0,0,0.3)' }

const Overlay = floral(styles)(
	({ children, closeOnEsc, closeOnClick, computedStyles }) => (
		<Fragment>
			<div style={computedStyles.root} />
			{props.children}
		</Fragment>
	)
)

Overlay.propTypes = {
	closeOnEsc: PropTypes.bool,
	cloneOnClick: PropTypes.bool
}

export default Overlay
