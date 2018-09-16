import React from 'react'

import DropdownStory from './dropdown.md'
import TooltipStory from './tooltip.md'

const componentsSection = {
	name: 'Components',
	stories: {
		dropdown: {
			name: 'Dropdown',
			markdown: DropdownStory
		},
		tooltip: {
			name: 'Tooltip',
			markdown: TooltipStory
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
