---
imports:
    Tooltip: '@clear-ui/tooltip'
    styles: '../dropdownStyles'
    '{ slide, scale }': '@clear-ui/core/lib/animations'
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

## Open and close timeout

```
<Tooltip content="Tooltip content" openTimeout={250}>
    {({ show, hide, isOpen }) => (
        <div class='button' onClick={() => isOpen ? hide() : show()}>
            Shows with delay
        </div>
    )}
</Tooltip>
```

Tooltip can start closing not immediately after the element loses hover,
but after some timeout, and when hovering the tooltip, closing timer is disabled.
It can be useful in situations when interaction with the tooltip is needed,
for example to copy the text or click the link inside.

```
<Tooltip
    hideTimeout={500}
    content={
        <div>
            Copy text{' '}
            <a href="http://google.com" target="_blank">Link</a>
        </div>
    }
>
    {({ show, hide, isOpen }) => (
        <div class='button' onClick={() => isOpen ? hide() : show()}>
            Hide with delay
        </div>
    )}
</Tooltip>
```
