import React, { Component, Fragment } from 'react'
import Dropdown from '@clear-ui/dropdown'
import styles from '../../dropdownStyles'

class ControlledDropdownExample extends Component {
	state = { isOpen: false }

	render() {
		return (
			<Fragment>
				<Dropdown
					trigger={<div style={styles.button}>Controlled dropdown</div>}
					style={styles.dropdown}
					isOpen={this.state.isOpen}
					onOpen={() => this.setState({ isOpen: true })}
					onClose={() => this.setState({ isOpen: false })}
				>
					<div style={styles.item}>Dropdown content</div>
				</Dropdown>{' '}
				Dropdown is open:{' '}
				<input
					type="checkbox"
					checked={this.state.isOpen}
					style={{ verticalAlign: 'middle' }}
					onChange={e => this.setState({ isOpen: e.target.checked })}
				/>
			</Fragment>
		)
	}
}

export default ControlledDropdownExample
