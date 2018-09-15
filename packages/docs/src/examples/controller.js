import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import pick from 'lodash.pick'

import withController from '@clear-ui/lib/utils/withController'

const button = {
	display: 'inline-block',
	fontSize: 16,
	borderRadius: 5,
	height: 35,
	color: '#fff',
	background: '#0080ff',
	padding: '5px 10px',
	boxSizing: 'border-box',
	border: 'none',
	marginRight: '10px',
	cursor: 'pointer'
}

const Dropdown = withController('isOpen')(
	({ isOpen, onChangeIsOpen, trigger, children }) => (
		<Fragment>
			// TODO when not function clone and set prop onClick
			{trigger(() => onChangeIsOpen(!isOpen))}
			{isOpen && (
				<div style={{ border: '1px solid #ccc', padding: 10 }}>
					{children}
				</div>
			)}
		</Fragment>
	)
)

class Example extends Component {
	state = {
		isOpen: false
	}

	render() {
		const { isOpen } = this.state

		return (
			<div style={{ width: 800, margin: 'auto', padding: 20 }}>
				Dropdown is open:{' '}
				<input
					type="checkbox"
					checked={isOpen}
					onChange={e => this.setState({ isOpen: e.target.checked })}
				/>
				<br />
				<br />
				<Dropdown
					trigger={toggle => (
						<div style={button} onClick={toggle}>
							Controlled dropdown
						</div>
					)}
					isOpen={isOpen}
					onChangeIsOpen={value => this.setState({ isOpen: value })}
				>
					Dropdown content
				</Dropdown>
				<br />
				<br />
				<Dropdown
					trigger={toggle => (
						<div style={button} onClick={toggle}>
							Uncontrolled dropdown
						</div>
					)}
				>
					Dropdown content
				</Dropdown>
			</div>
		)
	}
}

ReactDOM.render(<Example />, document.querySelector('#root'))
