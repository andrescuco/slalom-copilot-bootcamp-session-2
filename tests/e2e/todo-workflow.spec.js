const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/todo-page');

test.describe('TODO workflow', () => {
  test.beforeEach(async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.open();
  });

  test('creates, toggles, and deletes a todo item', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const title = `E2E workflow ${Date.now()}`;

    await todoPage.addTodo(title, '2026-12-31');
    await expect(todoPage.todoText(title)).toBeVisible();

    await todoPage.markFirstTodoComplete();
    await expect(page.getByText('Todo status updated')).toBeVisible();

    await todoPage.deleteButton(title).click();
    await expect(page.getByText('Todo deleted')).toBeVisible();
  });
});
