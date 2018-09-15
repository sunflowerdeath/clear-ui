// import '@babel/polyfill'
import ReactDOM from 'react-dom'
import React from 'react'
import MiniBook from 'minibook'
import 'minibook/lib/styles.css'

import { Stack } from '@clear-ui/core'

import coreSection from './core'
import componentsSection from './components'

const sections = {
	core: coreSection,
	components: componentsSection
}

ReactDOM.render(
	<Stack>
		<MiniBook title="Clear UI" sections={sections} />
	</Stack>,
	document.querySelector('#root')
)
