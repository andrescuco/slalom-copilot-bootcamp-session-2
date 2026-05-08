# Functional Requirements

This document defines the core functional requirements for the TODO app.

## Core Requirements

1. The user can create a new todo item with a title.
2. The user can edit an existing todo item.
3. The user can delete a todo item.
4. The user can mark a todo item as complete or incomplete.
5. The user can add or change a due date for a todo item.
6. The app displays todo items in a consistent order.
7. Incomplete todo items are shown before completed todo items.
8. Within the same completion state, todo items are sorted by due date from earliest to latest.
9. If two todo items have the same due date, the older item appears first.
10. The app preserves todo changes so they are available after a page refresh.

## Validation Rules

1. A todo title is required before a new item can be saved.
2. A due date, when provided, must be a valid calendar date.
3. The app should prevent duplicate empty submissions.
