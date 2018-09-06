import '@babel/polyfill'
import ReactDOM from 'react-dom'
import React from 'react'
import MiniBook from 'minibook'
import 'minibook/lib/styles.css'

import apiSection from './api'

const sections = {
	hello: {
		name: 'Hello',
		stories: {
			examples: {
				name: 'Examples',
				render: () => <div>Examples!</div>
			}
		}
	},
	api: apiSection,
	components: {
		name: 'Components',
		stories: {
			tooltip: {
				name: 'Tooltip',
				render: () => <div>TODO</div>
			},
			modal: {
				name: 'Modal',
				render: () => <div>TODO</div>
			},
			dropdown: {
				name: 'Dropdown',
				render: () => <div>TODO</div>
			},
			sticky: {
				name: 'Sticky',
				render: () => <div>TODO</div>
			},
			drawer: {
				name: 'Drawer',
				render: () => <div>TODO</div>
			},
			notification: {
				name: 'Notification',
				render: () => <div>TODO</div>
			}
		}
	}
}

ReactDOM.render(
	<MiniBook title="Z" sections={sections} />,
	document.querySelector('#root')
)
