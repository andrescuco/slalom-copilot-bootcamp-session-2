const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/todo-page');

test.describe('TODO validation', () => {
  test.beforeEach(async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.open();
  });

  test('keeps add button disabled for empty title', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await expect(todoPage.addButton).toBeDisabled();
    await todoPage.titleInput.fill('Valid title');
    await expect(todoPage.addButton).toBeEnabled();
  });

  test('shows due date after adding an item with due date', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const title = `E2E due date ${Date.now()}`;

    await todoPage.addTodo(title, '2026-11-15');
    const item = todoPage.todoItem(title);
    await expect(item).toBeVisible();
    await expect(item.getByText('Due: 2026-11-15')).toBeVisible();
  });
});
