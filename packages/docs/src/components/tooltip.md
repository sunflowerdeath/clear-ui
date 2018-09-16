---
imports:
    Tooltip: '@clear-ui/tooltip'
    '{ slide, scale }': '@clear-ui/core/lib/animations'
    styles: '../dropdownStyles'
    TooltipArrowExample: '../examples/TooltipArrowExample'
---

# Tooltip

## Example

```@example
<Tooltip content="Tooltip content" style={styles.dropdown}>
    {({ show, hide }) => (
        <div style={styles.button} onMouseEnter={show} onMouseLeave={hide}>
            Show on hover
        </div>
    )}
</Tooltip>

<Tooltip content="Tooltip content" style={styles.dropdown}>
    {({ show, hide, isOpen }) => (
        <div style={styles.button} onClick={() => isOpen ? hide() : show()}>
            Show/hide on click
        </div>
    )}
</Tooltip>
```

## Show and hide delay

```@example
<Tooltip content="Tooltip content" showDelay={500} style={styles.dropdown}>
    {({ show, hide, isOpen }) => (
        <div style={styles.button} onMouseEnter={show} onMouseLeave={hide}>
            Shows with delay
        </div>
    )}
</Tooltip>
```

Tooltip can start closing not immediately after the element loses hover,
but after some timeout, and when hovering the tooltip, closing timer is disabled.
It can be useful in situations when interaction with the tooltip is needed,
for example to copy the text or click the link inside.

```@example
<Tooltip
    hideDelay={500}
    style={styles.dropdown}
    content={
        <div>
            Copy text{' '}
            <a href="http://google.com" target="_blank">Link</a>
        </div>
    }
>
    {({ show, hide, isOpen }) => (
        <div style={styles.button} onMouseEnter={show} onMouseLeave={hide}>
            Hide with delay
        </div>
    )}
</Tooltip>
```

## Arrow

```@render
<TooltipArrowExample />
```
