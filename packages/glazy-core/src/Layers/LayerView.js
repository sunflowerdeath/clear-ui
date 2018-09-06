import React, { PureComponent } from 'react'

import LayersContext from './LayersContext'

const getStyle = ({ type }) =>
	type === 'initial'
		? { position: 'relative', height: '100%' }
		: { position: 'absolute', top: 0, left: 0 }

class LayerView extends PureComponent {
	render() {
		const { id, children } = this.props
		return (
			<LayersContext.Provider value={id}>
				<div style={getStyle(this.props)}>{children}</div>
			</LayersContext.Provider>
		)
	}
}

export default LayerView
