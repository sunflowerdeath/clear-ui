import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import LayerView from './LayerView'
import LAYER_TYPES from './layerTypes'

let id = 0
const getNextId = () => id++

class Stack extends Component {
	static proxyMethod(name, args) {
		if (!this.instance) {
			throw new Error('In order to create layers you need to render Stack')
		}
		return this.instance[name](...args)
	}

	static createLayer(...args) {
		return this.proxyMethod('createLayer', args)
	}

	static updateLayer(...args) {
		return this.proxyMethod('updateLayer', args)
	}

	static removeLayer(...args) {
		return this.proxyMethod('removeLayer', args)
	}

	static propTypes = {
		element: PropTypes.string,
		index: PropTypes.number
	}

	constructor() {
		super()
		this.state = { layers: [] }
	}

	componentWillMount() {
		Stack.instance = this
	}

	componentWillUnmount() {
		Stack.instance = undefined
	}

	/**
	 * Creates new layer.
	 * @param {parentId|false} [elem] - Parent layer id.
	 *   If `false`, layer will be added to the initial layer.
	 * @param {props} object - Layer props.
	 * @param {function} onRender - Function that is called after layer is rendered.
	 *
	 * @return {string} Layer id.
	 */
	createLayer(parentId, props, onRender) {
		const id = getNextId()
		this.setState(state => {
			const { layers } = state
			const priority = LAYER_TYPES.indexOf(props.type)

			// Skip all layers up to parent layer
			const initialSkipped =
				parentId !== undefined
					? layers.findIndex(({ id }) => id === parentId) + 1
					: 0

			let skipped
			// Skip all layers with priority lower than or equal to
			// the priority of the added layer.
			for (skipped = initialSkipped; skipped < layers.length; skipped++) {
				const nextLayer = layers[skipped]
				if (!nextLayer) break
				if (priority < LAYER_TYPES.indexOf(nextLayer.props.type)) break
			}

			return {
				layers: [
					...layers.slice(0, skipped),
					{ id, props },
					...layers.slice(skipped)
				]
			}
		}, () => onRender(id))
	}

	updateLayer(id, props) {
		this.setState(state => ({
			layers: state.layers.map(
				layer => (id === layer.id ? { ...layer, props } : layer)
			)
		}))
	}

	removeLayer(id) {
		this.setState(state => ({
			layers: state.layers.filter(layer => id !== layer.id)
		}))
	}

	render() {
		const { children } = this.props
		const { layers } = this.state

		return (
			<Fragment>
				<LayerView type="initial" key="initial">
					{children}
				</LayerView>
				{layers.map(({ id, props }) => (
					<LayerView id={id} key={id} {...props} />
				))}
			</Fragment>
		)
	}
}

export default Stack
