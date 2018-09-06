import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'

import { Stack, Layer } from 'zz-core/lib/Layers'

const style = {
	background: '#ddd',
	position: 'absolute',
	padding: 10,
	boxSizing: 'border-box',
	border: '1px solid #aaa',
	width: 150,
	height: 75
}

class Example extends Component {
	state = {
		tooltip1: false,
		tooltip2: false,
		modal1: false,
		modalTooltip: false,
		modal2: false
	}

	renderCheckbox(name) {
		const value = this.state[name]
		return (
			<div>
				{name}
				<input
					type="checkbox"
					value={value}
					onChange={() => this.setState({ [name]: !this.state[name] })}
				/>
			</div>
		)
	}

	render() {
		const { tooltip1, tooltip2, modal1, modalTooltip, modal2 } = this.state

		return (
			<div>
				{this.renderCheckbox('tooltip1')}
				{this.renderCheckbox('tooltip2')}
				{this.renderCheckbox('modal1')}
				{this.renderCheckbox('modalTooltip')}
				{this.renderCheckbox('modal2')}
				<Layer type="popup" isActive={tooltip1}>
					<div style={{ ...style, top: 100, left: 100 }}>Tooltip 1</div>
				</Layer>
				<Layer type="popup" isActive={tooltip2}>
					<div style={{ ...style, top: 140, left: 180 }}>Tooltip 2</div>
				</Layer>
				<Layer type="modal" isActive={modal1}>
					<div style={{ ...style, top: 160, left: 60 }}>Modal</div>
					<Layer type="popup" isActive={modalTooltip}>
						<div style={{ ...style, top: 180, left: 100 }}>
							Modal Tooltip
						</div>
					</Layer>
				</Layer>
				<Layer type="modal" isActive={modal2}>
					<div style={{ ...style, top: 220, left: 140 }}>Modal 2</div>
				</Layer>
			</div>
		)
	}
}

ReactDOM.render(
	<Stack>
		<Example />
	</Stack>,
	document.querySelector('#root')
)
