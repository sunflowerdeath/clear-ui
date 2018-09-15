import React, { Component } from 'react'
import pick from 'lodash.pick'

/*
Higher order component that allows to use controlled component as uncontrolled.

Example:

<Dropdown
	isOpen={this.state.isOpen}
	onChangeIsOpen={isOpen => this.setState({ isOpen })}
>
	content
</Dropdown>

// withController(propName: string, updateHandlerName: string)

const DropdownWithController = withController('isOpen', 'onChangeIsOpen')(Dropdown)

// different update handlers
// withController(propName: string, updateHandlers: object)

const DropdownWithController = withController('isOpen', {
	onOpen: updateValue => () => updateValue(true),
	onClose: updateValue => () => updateValue(false)
})(Dropdown)
```
*/

const withController = (propName, updateHandlers) => ControlledComponent => {
	if (typeof updateHandlers === 'string') {
		updateHandlers = {
			[updateHandlers]: update => value => update(value)
		}
	}

	const name = ControlledComponent.displayName || ControlledComponent.name

	class Controller extends Component {
		static displayName = name ? `withController(${name})` : `withController`

		static getDerivedStateFromProps(nextProps) {
			return pick(nextProps, propName)
		}

		static innerComponent = ControlledComponent

		constructor() {
			super()
			this.state = { ...pick(this.props, propName) }
			this.updateStateValue = this.updateStateValue.bind(this)
		}

		updateStateValue(value) {
			this.setState({ [propName]: value })
		}

		handleUpdate(handlerName, args) {
			if (!(propName in this.props)) {
				updateHandlers[handlerName](this.updateStateValue)(...args)
			}
			const handler = this.props[handlerName]
			if (handler) handler(...args)
		}

		render() {
			const props = {
				...this.props,
				[propName]: this.state[propName]
			}
			Object.keys(updateHandlers).forEach(handlerName => {
				props[handlerName] = (...args) =>
					this.handleUpdate(handlerName, args)
			})
			return <ControlledComponent {...props} />
		}
	}

	return Controller
}

export default withController
