import ReactDOM from 'react-dom'
import React, { Component, Fragment } from 'react'
import Draggable from 'react-draggable'

import Attachment from 'zz-core/lib/Attachment/AttachmentComponent'

const styles = {
	root: {
		height: window.innerHeight * 2
	},
	menu: {
		fontSize: '14px',
		position: 'fixed',
		top: 10,
		right: 10,
		width: 250,
		background: '#eee',
		padding: 10,
		paddingBottom: 0,
		boxSizing: 'border-box',
		border: '1px solid #ccc'
	},
	title: {
		fontWeight: 'bold',
		marginBottom: 5
	},
	label: {
		marginRight: 5
	},
	row: {
		marginBottom: 10,
		display: 'flex',
		justifyContent: 'space-between'
	},
	col: {
		width: '48%'
	},
	input: {
		width: 60
	},
	target: {
		position: 'absolute',
		width: 120,
		height: 50,
		background: '#666',
		color: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'move',
		userSelect: 'none',
		borderRadius: 3,
		letterSpacing: '1px',
		willChange: 'transform'
	},
	element: {
		position: 'absolute',
		width: 180,
		height: 75,
		display: 'flex',
		background: '#ccc',
		alignItems: 'center',
		justifyContent: 'center',
		userSelect: 'none',
		borderRadius: 3,
		letterSpacing: '1px',
		willChange: 'transform'
	}
}

class Demo extends Component {
	state = {
		top: 100,
		left: 100,
		elemHoriz: 'left',
		elemVert: 'top',
		targetHoriz: 'left',
		targetVert: 'bottom',
		offsetHoriz: '0',
		offsetVert: '10',
		mirror: 'none',
		constrain: false,
		viewportPadding: '10'
	}

	renderMenu() {
		const {
			elemHoriz,
			elemVert,
			targetHoriz,
			targetVert,
			offsetHoriz,
			offsetVert,
			mirror,
			constrain,
			viewportPadding
		} = this.state

		const vertValues = ['top', 'center', 'bottom'].map(value => (
			<option value={value} key={value}>
				{value}
			</option>
		))

		const horizValues = ['left', 'center', 'right'].map(value => (
			<option value={value} key={value}>
				{value}
			</option>
		))

		const mirrorValues = ['none', 'all', 'horiz', 'vert'].map(value => (
			<option value={value} key={value}>
				{value}
			</option>
		))

		return (
			<div style={styles.menu}>
				<div style={styles.title}>target</div>
				<div style={styles.row}>
					<div style={styles.col}>
						<span style={styles.label}>horiz</span>
						<select
							value={targetHoriz}
							onChange={e =>
								this.setState({ targetHoriz: e.target.value })
							}
						>
							{horizValues}
						</select>
					</div>
					<div style={styles.col}>
						<span style={styles.label}>vert</span>
						<select
							value={targetVert}
							onChange={e =>
								this.setState({ targetVert: e.target.value })
							}
						>
							{vertValues}
						</select>
					</div>
				</div>

				<div style={styles.title}>element</div>
				<div style={styles.row}>
					<div style={styles.col}>
						<span style={styles.label}>horiz</span>
						<select
							value={elemHoriz}
							onChange={e =>
								this.setState({ elemHoriz: e.target.value })
							}
						>
							{horizValues}
						</select>
					</div>
					<div style={styles.col}>
						<span style={styles.label}>vert</span>
						<select
							value={elemVert}
							onChange={e =>
								this.setState({ elemVert: e.target.value })
							}
						>
							{vertValues}
						</select>
					</div>
				</div>

				<div style={styles.title}>offset</div>

				<div style={styles.row}>
					<div style={styles.col}>
						<span style={styles.label}>horiz</span>
						<input
							style={styles.input}
							value={offsetHoriz}
							onChange={e =>
								this.setState({ offsetHoriz: e.target.value })
							}
						/>
					</div>

					<div style={styles.col}>
						<span style={styles.label}>vert</span>
						<input
							style={styles.input}
							value={offsetVert}
							onChange={e =>
								this.setState({ offsetVert: e.target.value })
							}
						/>
					</div>
				</div>

				<div style={styles.row}>
					<div style={styles.col}>
						<span style={styles.label}>mirror</span>
						<select
							value={mirror}
							onChange={e => this.setState({ mirror: e.target.value })}
						>
							{mirrorValues}
						</select>
					</div>

					<div style={styles.col}>
						<input
							type="checkbox"
							style={{ verticalAlign: 'middle' }}
							value={constrain}
							onChange={e => this.setState({ constrain: !constrain })}
						/>
						<span style={styles.label}>constrain</span>
					</div>
				</div>

				<div style={styles.row}>
					<div>
						<span style={styles.label}>viewport padding</span>
						<input
							style={styles.input}
							value={viewportPadding}
							onChange={e =>
								this.setState({ viewportPadding: e.target.value })
							}
						/>
					</div>
				</div>
			</div>
		)
	}

	renderTarget() {
		const { left, top } = this.state
		return (
			<Draggable
				onDrag={(e, data) => this.setState({ left: data.x, top: data.y })}
				position={{ x: left, y: top }}
			>
				<div style={styles.target}>TARGET</div>
			</Draggable>
		)
	}

	renderElement({ elementRef }) {
		return (
			<div style={styles.element} ref={elementRef}>
				ELEMENT
			</div>
		)
	}

	render() {
		const {
			elemHoriz,
			elemVert,
			targetHoriz,
			targetVert,
			offsetHoriz,
			offsetVert,
			mirror,
			constrain,
			viewportPadding
		} = this.state

		return (
			<div style={styles.root}>
				{this.renderMenu()}
				<Attachment
					isActive={true}
					element={this.renderElement.bind(this)}
					attachment={{
						element: `${elemHoriz} ${elemVert}`,
						target: `${targetHoriz} ${targetVert}`,
						offset: `${offsetHoriz}px ${offsetVert}px`
					}}
					mirrorAttachment={mirror}
					constrain={constrain}
					viewportPadding={parseInt(viewportPadding, 10)}
				>
					{this.renderTarget()}
				</Attachment>
			</div>
		)
	}
}

ReactDOM.render(<Demo />, document.querySelector('#root'))
