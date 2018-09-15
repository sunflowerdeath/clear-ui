import React from 'react'

import LayersStory from './layers.md'
import AttachmentStory from './attachment.md'

const coreSection = {
	name: 'Core',
	stories: {
		layers: {
			name: 'Layers',
			markdown: LayersStory
		},
		attachment: {
			name: 'Attachment',
			markdown: AttachmentStory
		},
		overlay: {
			name: 'Overlay',
			render: () => <div>TODO</div>
		},
	}
}

export default coreSection
