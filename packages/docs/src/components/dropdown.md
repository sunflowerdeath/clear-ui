---
imports:
    Dropdown: '@clear-ui/dropdown'
    styles: '../dropdownStyles'
    '{ TimingAnimation }': 'react-spring/dist/addons'
    '{ slide, scale }': '@clear-ui/core/lib/animations'
    ControlledDropdownExample: '../examples/dropdown/ControlledDropdown'
---

# Dropdown

Dropdown is a component that displays overlay with content 
when you click on the trigger element.

## Install

```
npm install @clear-ui/dropdown
```

## Example

```@example
<Dropdown
    trigger={<div style={styles.button}>Dropdown trigger</div>}
    style={styles.dropdown}
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>
```

## Sides

By default, dropdown shows at the bottom if there is enough space,
otherwise at the top.
Horizontally dropdown expands to the right side.
You can change these sides to opposite.

```@example
<Dropdown
    trigger={<div style={styles.button}>Show on top</div>}
    style={{ ...styles.dropdown, width: 200 }}
    vertSide="top"
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>

<Dropdown
    trigger={<div style={styles.button}>Expand to left</div>}
    style={{ ...styles.dropdown, width: 200 }}
    expandSide="left"
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>
```

## Animations

```@example
<Dropdown
    trigger={<div style={styles.button}>Fade (default)</div>}
    style={styles.dropdown}
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>

<Dropdown
    trigger={<div style={styles.button}>Slide</div>}
    style={styles.dropdown}
    animation={{
        style: options => slide({ distance: 35, ...options })
    }}
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>

<Dropdown
    trigger={<div style={styles.button}>Scale</div>}
    style={styles.dropdown}
    animation={{
        style: options => scale({ initialScale: { x: 0.75, y: 0.5 }, ...options })
    }}
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>

<Dropdown
    trigger={<div style={styles.button}>Faster spring</div>}
    style={styles.dropdown}
    animation={{
        style: options => slide({ distance: 35, ...options }),
        config: { tension: 560, friction: 35 }
    }}
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>

<Dropdown
    trigger={<div style={styles.button}>Timing</div>}
    style={styles.dropdown}
    animation={{
        style: options => slide({ distance: 35, ...options }),
        impl: TimingAnimation,
        config: { duration: 500 }
    }}
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>

<Dropdown
    trigger={<div style={styles.button}>No animation</div>}
    style={styles.dropdown}
    animation={false}
>
    <div style={styles.item}>Dropdown content</div>
</Dropdown>
```

## Scrolling

When there is a lot of content inside dropdown,
you can limit max height, or constrain dropdown in the viewport.

```@example
<Dropdown
    trigger={<div style={styles.button}>Max height</div>}
    style={{ ...styles.dropdown, overflowX: 'auto' }}
    maxHeight={300}
>
    {Array(40).fill(0).map((_, i) => <div style={styles.item} key={i}>Item</div>)}
</Dropdown>

<Dropdown
    trigger={<div style={styles.button}>Constrain in viewport</div>}
    style={{ ...styles.dropdown, overflowX: 'auto' }}
    constrain={true}
>
    {Array(40).fill(0).map((_, i) => <div style={styles.item} key={i}>Item</div>)}
</Dropdown>
```

## Controlled dropdown

You can use props `isOpen`, `onOpen` and `onClose` to control
state of the dropdown from the parent component.

```@render
<ControlledDropdownExample />
```

```@source
file: '../examples/dropdown/ControlledDropdown.js'
tabs: 4
```
