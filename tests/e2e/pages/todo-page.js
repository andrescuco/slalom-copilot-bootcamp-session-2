class TodoPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByRole('textbox', { name: 'Todo title' });
    this.dueDateInput = page.getByLabel('Due date');
    this.addButton = page.getByRole('button', { name: 'Add Todo' });
  }

  async open() {
    await this.page.goto('/');
    await this.page.getByRole('heading', { name: 'TODO Planner' }).waitFor();
  }

  async addTodo(title, dueDate) {
    await this.titleInput.fill(title);
    if (dueDate) {
      await this.dueDateInput.fill(dueDate);
    }
    await this.addButton.click();
  }

  todoText(title) {
    return this.page.getByText(title, { exact: true });
  }

  editButton(title) {
    return this.page.getByRole('button', { name: `Edit ${title}` });
  }

  deleteButton(title) {
    return this.page.getByRole('button', { name: `Delete ${title}` });
  }

  async markFirstTodoComplete() {
    const firstCheckbox = this.page.getByRole('checkbox').first();
    await firstCheckbox.click();
  }
}

module.exports = { TodoPage };
