import React from 'react'

const cloneElementWithRef = (element, props, ...children) => {
	const cloneRef = props.ref
	const originalRef = element.ref

	if (!originalRef || !cloneRef) {
		return React.cloneElement(element, props, ...children)
	}

	if (typeof originalRef !== 'function') {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(
				"'cloneElementWithRef()' doesn't support string refs. " +
					`Ref ${originalRef} is ignored.`
			)
		}
		return React.cloneElement(element, props, ...children)
	}

	return React.cloneElement(
		element,
		{
			...props,
			ref: component => {
				cloneRef(component)
				originalRef(component)
			}
		},
		...children
	)
}

export default cloneElementWithRef
