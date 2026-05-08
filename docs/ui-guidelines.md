# UI Guidelines

This document defines the core UI guidelines for the TODO app.

## Design System

1. Use Material Design components as the primary UI foundation.
2. Prefer a single, consistent component library for form controls, buttons, dialogs, and lists.
3. Keep the interface simple and task-focused, with clear hierarchy and minimal visual noise.

## Color and Typography

1. Use a restrained color palette with one primary color, one secondary color, and clear semantic colors for success, warning, and error states.
2. Maintain accessible contrast for all text and interactive elements.
3. Use one readable sans-serif type family throughout the app.
4. Reserve bold or larger typography for page titles, section headings, and key task states.

## Layout and Spacing

1. Use a responsive single-column layout on small screens and a centered content container on larger screens.
2. Keep spacing consistent by using a fixed spacing scale across cards, forms, and list items.
3. Align related controls together and separate distinct actions visually.
4. Avoid crowding; every task item should have enough whitespace to be scanned quickly.

## Buttons and Actions

1. Use a contained primary button for the main action, such as adding or saving a todo.
2. Use outlined or text buttons for secondary actions, such as canceling edits.
3. Use a destructive style for delete actions, and make those actions visually distinct from primary actions.
4. Disable buttons when their action is not currently valid, such as saving an empty todo.

## Form Behavior

1. Show labels for all inputs; do not rely on placeholder text alone.
2. Display inline validation messages near the affected field.
3. Keep form controls aligned and make tap targets large enough for touch devices.
4. Preserve input state during edit flows until the user explicitly saves or cancels.

## Accessibility

1. Support full keyboard navigation for all interactive elements.
2. Provide visible focus states for links, buttons, and form inputs.
3. Use semantic HTML elements wherever possible.
4. Announce validation and status changes to assistive technologies.
5. Ensure icons and icon-only buttons have accessible labels.
6. Maintain sufficient hit area size for interactive controls.

## Empty, Loading, and Error States

1. Show a clear loading indicator while todos are being fetched or saved.
2. Show a helpful empty state when no todos exist.
3. Present error messages in a clear, readable format with guidance for recovery when possible.

## Consistency

1. Keep list item layout, spacing, and action placement consistent across all todo states.
2. Use the same visual language for create, edit, and delete flows throughout the app.
3. Do not introduce new colors, button styles, or component patterns without updating this document.
