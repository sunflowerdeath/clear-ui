import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import LayersContext from './LayersContext'
import Stack from './Stack'
import LAYER_TYPES from './layerTypes'

class Layer extends PureComponent {
	static propTypes = {
		/** Controls the visibility of the layer. */
		isActive: PropTypes.bool,

		/**
		 * Layer type. It affects order of layers.
		 *
		 * Possible layer types in order of their priority:
		 * `'initial'`, `'popup'`, `'fixed'`, `'modal'`, `'global'`.
		 */
		type: PropTypes.oneOf(LAYER_TYPES),

		/** Function that is called when layer is rendered on the page. */
		onRender: PropTypes.func
	}

	static defaultProps = {
		type: 'popup'
	}

	componentDidMount() {
		if (this.props.isActive) this.createLayer()
	}

	componentDidUpdate() {
		if (this.props.isActive) {
			if (this.layerId === undefined) this.createLayer()
			else this.updateLayer()
		} else {
			if (this.layerId !== undefined) this.removeLayer()
		}
	}

	componentWillUnmount() {
		if (this.layerId !== undefined) this.removeLayer()
	}

	createLayer() {
		const { parentId, ...layerProps } = this.props
		Stack.createLayer(parentId, layerProps, id => {
			this.layerId = id
		})
	}

	updateLayer() {
		const { parentId, ...layerProps } = this.props
		Stack.updateLayer(this.layerId, layerProps)
	}

	removeLayer() {
		Stack.removeLayer(this.layerId)
		this.layerId = undefined
	}

	render() {
		return null
	}
}

const LayerWithContext = props => (
	<LayersContext.Consumer>
		{parentId => <Layer {...props} parentId={parentId} />}
	</LayersContext.Consumer>
)

export default LayerWithContext
