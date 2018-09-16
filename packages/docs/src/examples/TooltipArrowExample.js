import React, { Component } from 'react'
import Tooltip from '@clear-ui/tooltip'
import TooltipArrow from '@clear-ui/tooltip/lib/TooltipArrow'
import styles from '../dropdownStyles'

const RadioGroup = ({ options, value, onChange }) =>
	options.map(option => (
		<label key={option}>
			<input
				type="radio"
				value={option}
				checked={option === value}
				onChange={() => onChange(option)}
			/>
			{option}
		</label>
	))

const mstyles = {
	root: { display: 'flex', height: 100 },
	controls: { width: '300px', alignItems: 'center' },
	tooltip: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexGrow: 1
	}
}

class TooltipArrowExample extends Component {
	state = {
		align: 'end',
		side: 'top'
	}

	renderOptions() {
		const { side, align } = this.state
		return (
			<div style={mstyles.controls}>
				Align:{' '}
				<RadioGroup
					options={['begin', 'center', 'end']}
					value={align}
					onChange={value => this.setState({ align: value })}
				/>
				<br />
				Side:{' '}
				<RadioGroup
					options={['top', 'bottom', 'left', 'right']}
					value={side}
					onChange={value => this.setState({ side: value })}
				/>
			</div>
		)
	}

	renderTooltip() {
		const { side, align } = this.state
		return (
			<Tooltip
				content={({ side }) => (
					<div>
						<TooltipArrow
							side={side}
							align={align}
							width={20}
							height={10}
							margin={10}
							unit="px"
							style={{ background: 'red' }}
						/>
						Tooltip content {side}
					</div>
				)}
				style={{ ...styles.dropdown, width: 150, height: 75 }}
				align={align}
				sides={[side]}
			>
				{({ show, hide, isOpen }) => (
					<div
						style={styles.button}
						onClick={() => (isOpen ? hide() : show())}
					>
						Tooltip
					</div>
				)}
			</Tooltip>
		)
	}

	render() {
		return (
			<div style={mstyles.root}>
				{this.renderOptions()}
				<div style={mstyles.tooltip}>{this.renderTooltip()}</div>
			</div>
		)
	}
}

export default TooltipArrowExample
