import React from 'react'

import DropdownStory from './dropdown.md'

const componentsSection = {
	name: 'Components',
	stories: {
		dropdown: {
			name: 'Dropdown',
			markdown: DropdownStory
		},
		tooltip: {
			name: 'Tooltip',
			render: () => <div>TODO</div>
		},
		modal: {
			name: 'Modal',
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

export default componentsSection
