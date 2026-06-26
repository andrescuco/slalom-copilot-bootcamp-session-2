# Coding Guidelines

This document captures the project's coding style and software quality principles. The goal is to keep the codebase readable, consistent, and easy to evolve as features are added over time.

## Core Principles

Write code for humans first and machines second. Favor clarity over cleverness, and optimize for maintainability unless performance requirements clearly justify complexity.

Follow the DRY (Don't Repeat Yourself) principle by extracting repeated logic into shared functions, utilities, or components. Avoid over-abstraction: only generalize when duplication is meaningful and likely to recur.

Apply the single responsibility principle where practical. Functions, modules, and components should do one thing well and expose clear interfaces.

## Formatting and Readability

Use consistent formatting throughout the repository to reduce cognitive load during reviews.

- Keep indentation, spacing, and line breaks consistent with existing project conventions.
- Prefer descriptive names for variables, functions, and components.
- Keep functions focused and reasonably small; split large blocks into helper functions when intent is unclear.
- Use comments sparingly and intentionally; explain why complex logic exists rather than what obvious code is doing.

## Import Organization

Organize imports in a predictable order to improve scanability and reduce merge conflicts.

- Group imports by source type: built-in modules, third-party packages, then local files.
- Keep related imports together and remove unused imports.
- Prefer explicit, stable import paths.
- Avoid circular dependencies by keeping module responsibilities clear and directional.

## Linting and Code Quality Tooling

Linting is required for maintaining consistency and catching defects early.

- Use ESLint as the primary linting tool for JavaScript and React code.
- Treat linter warnings as actionable and fix them before merging whenever possible.
- Run lint checks locally before opening or updating pull requests.
- Keep lint rule changes intentional and documented when project standards evolve.

## Best Practices for Maintainable Code

- Favor composition over deep inheritance or tightly coupled structures.
- Validate inputs and handle failure paths explicitly.
- Avoid hardcoded values where configuration is more appropriate.
- Keep side effects controlled and visible at module boundaries.
- Make incremental, reviewable changes rather than large, risky rewrites.

## Testing and Quality Expectations

Coding standards and testing standards go hand in hand.

- Ensure new code is accompanied by appropriate automated tests.
- Design code to be testable by separating business logic from framework and I/O concerns.
- Refactor safely by preserving behavior and maintaining test coverage.

## Pull Request Readiness

Before submitting code for review:

- Confirm lint and test checks pass.
- Remove dead code, debugging artifacts, and commented-out blocks.
- Verify naming, structure, and error handling align with these guidelines.
- Ensure documentation is updated when behavior or developer workflows change.
