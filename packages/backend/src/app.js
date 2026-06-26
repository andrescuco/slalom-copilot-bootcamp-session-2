const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidDueDate = (value) => {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const normalizeDueDate = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return value;
};

const createApp = ({ dbPath = process.env.DB_PATH || 'todos.db' } = {}) => {
  const app = express();
  const db = new Database(dbPath);

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      due_date TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const selectByIdStmt = db.prepare('SELECT * FROM todos WHERE id = ?');
  const listTodosStmt = db.prepare(`
    SELECT *
    FROM todos
    ORDER BY
      completed ASC,
      CASE WHEN due_date IS NULL THEN 1 ELSE 0 END ASC,
      due_date ASC,
      created_at ASC,
      id ASC
  `);
  const insertTodoStmt = db.prepare(`
    INSERT INTO todos (title, due_date, completed)
    VALUES (@title, @due_date, @completed)
  `);
  const deleteTodoStmt = db.prepare('DELETE FROM todos WHERE id = ?');

  app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'TODO backend server is running' });
  });

  app.get('/api/todos', (req, res) => {
    try {
      const todos = listTodosStmt.all().map((todo) => ({
        ...todo,
        completed: Boolean(todo.completed),
      }));
      res.json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  });

  app.post('/api/todos', (req, res) => {
    try {
      const { title, dueDate } = req.body;

      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Todo title is required' });
      }

      if (!isValidDueDate(dueDate)) {
        return res.status(400).json({ error: 'Due date must be a valid YYYY-MM-DD date' });
      }

      const result = insertTodoStmt.run({
        title: title.trim(),
        due_date: normalizeDueDate(dueDate),
        completed: 0,
      });

      const todo = selectByIdStmt.get(result.lastInsertRowid);
      res.status(201).json({ ...todo, completed: Boolean(todo.completed) });
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({ error: 'Failed to create todo' });
    }
  });

  app.put('/api/todos/:id', (req, res) => {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Valid todo ID is required' });
      }

      const existing = selectByIdStmt.get(id);
      if (!existing) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      const hasTitle = Object.prototype.hasOwnProperty.call(req.body, 'title');
      const hasDueDate = Object.prototype.hasOwnProperty.call(req.body, 'dueDate');
      const hasCompleted = Object.prototype.hasOwnProperty.call(req.body, 'completed');

      if (!hasTitle && !hasDueDate && !hasCompleted) {
        return res.status(400).json({ error: 'At least one field must be provided' });
      }

      let title = existing.title;
      if (hasTitle) {
        if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
          return res.status(400).json({ error: 'Todo title is required' });
        }
        title = req.body.title.trim();
      }

      let dueDate = existing.due_date;
      if (hasDueDate) {
        if (!isValidDueDate(req.body.dueDate)) {
          return res.status(400).json({ error: 'Due date must be a valid YYYY-MM-DD date' });
        }
        dueDate = normalizeDueDate(req.body.dueDate);
      }

      let completed = Boolean(existing.completed);
      if (hasCompleted) {
        if (typeof req.body.completed !== 'boolean') {
          return res.status(400).json({ error: 'Completed must be a boolean' });
        }
        completed = req.body.completed;
      }

      db.prepare(
        'UPDATE todos SET title = @title, due_date = @due_date, completed = @completed WHERE id = @id'
      ).run({
        id,
        title,
        due_date: dueDate,
        completed: completed ? 1 : 0,
      });

      const updated = selectByIdStmt.get(id);
      res.json({ ...updated, completed: Boolean(updated.completed) });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Failed to update todo' });
    }
  });

  app.patch('/api/todos/:id/toggle', (req, res) => {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Valid todo ID is required' });
      }

      const existing = selectByIdStmt.get(id);
      if (!existing) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      const nextCompleted = existing.completed ? 0 : 1;
      db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(nextCompleted, id);

      const updated = selectByIdStmt.get(id);
      res.json({ ...updated, completed: Boolean(updated.completed) });
    } catch (error) {
      console.error('Error toggling todo:', error);
      res.status(500).json({ error: 'Failed to toggle todo' });
    }
  });

  app.delete('/api/todos/:id', (req, res) => {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Valid todo ID is required' });
      }

      const result = deleteTodoStmt.run(id);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      res.json({ message: 'Todo deleted successfully', id });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  });

  const close = () => db.close();

  return { app, db, close };
};

const { app, db, close } = createApp();

module.exports = {
  app,
  close,
  createApp,
  db,
  isValidDueDate,
};
