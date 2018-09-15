import { controller } from 'react-spring'

const animate = ({ value, to, impl, config, callback }) => {
	controller(value, { to, ...config }, impl).start(callback)
}
const fade = ({ value }) => ({ opacity: value })

const slide = ({ direction = 'top', distance = 10, unit = 'px', value }) => ({
	opacity: value,
	transform: value
		.interpolate({ range: [0, 1], output: [-distance, 0] })
		.interpolate(
			v => do {
				if (direction === 'top') `translateY(${-v}${unit})`
				else if (direction === 'bottom') `translateY(${v}${unit})`
				else if (direction === 'left') `translateX(${-v}${unit})`
				else if (direction === 'right') `translateX(${v}${unit})`
			}
		)
})

const scale = ({ initialScale: { x, y }, value }) => ({
	opacity: value,
	transformOrigin: '0 0',
	transform: value
		.interpolate({
			range: [0, 1],
			output: [`scale(${x}, ${y})`, 'scale(1, 1)']
		})
})

export { animate, fade, slide, scale }
