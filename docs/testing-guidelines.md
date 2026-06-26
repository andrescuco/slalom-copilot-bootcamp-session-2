# Testing Guidelines

This document outlines the testing principles and best practices for this project.

## Unit Tests

- **Framework**: Use Jest to test individual functions and React components in isolation
- **Naming Convention**: Files should follow `*.test.js` or `*.test.ts` naming pattern
- **Backend Location**: Place backend unit tests in `packages/backend/__tests__/` directory
- **Frontend Location**: Place frontend unit tests in `packages/frontend/src/__tests__/` directory
- **File Naming**: Name unit test files to match what they're testing (e.g., `app.test.js` for testing `app.js`)

## Integration Tests

- **Framework**: Use Jest + Supertest to test backend API endpoints with real HTTP requests
- **Location**: Place integration tests in `packages/backend/__tests__/integration/` directory
- **Naming Convention**: Files should follow `*.test.js` or `*.test.ts` naming pattern
- **File Naming**: Name integration test files intelligently based on what they test (e.g., `todos-api.test.js` for TODO API endpoints)

## End-to-End (E2E) Tests

- **Framework**: Use Playwright (the required framework) to test complete UI workflows through browser automation
- **Location**: Place E2E tests in `tests/e2e/` directory
- **Naming Convention**: Files should follow `*.spec.js` or `*.spec.ts` naming pattern
- **File Naming**: Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`)
- **Browser Configuration**: Playwright tests must use one browser only
- **Design Pattern**: Playwright tests must use the Page Object Model (POM) pattern for maintainability
- **Test Scope**: Limit E2E tests to 5-8 critical user journeys - focus on happy paths and key edge cases, not exhaustive coverage

## General Testing Principles

### Test Isolation and Independence

- **All tests must be isolated and independent** - each test should set up its own data and not rely on other tests
- Tests should be able to run in any order and produce consistent results

### Setup and Teardown

- **Setup and teardown hooks are required** - tests must succeed on multiple runs
- Ensure proper cleanup of resources and test data after each test

### Port Configuration

- **Always use environment variables with sensible defaults** for port configuration to allow CI/CD workflows to dynamically detect ports
- **Backend**: `const PORT = process.env.PORT || 3030;`
- **Frontend**: React's default port is 3000, but can be overridden with `PORT` environment variable

## Feature Development Requirements

- **All new features should include appropriate tests** based on the type of feature
- Tests should be maintainable and follow best practices
- Consider testing all layers: unit, integration, and E2E as appropriate for the feature
