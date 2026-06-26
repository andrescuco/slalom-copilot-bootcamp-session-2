import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const todos = [
  { id: 1, title: 'Prepare backlog', completed: false, due_date: '2026-07-01' },
  { id: 2, title: 'Ship release notes', completed: true, due_date: null },
];

const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => res(ctx.status(200), ctx.json(todos))),
  rest.post('/api/todos', (req, res, ctx) => {
    const body = req.body;
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title: body.title,
        completed: false,
        due_date: body.dueDate || null,
      })
    );
  }),
  rest.patch('/api/todos/:id/toggle', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ id: Number(req.params.id), completed: true }))
  ),
  rest.put('/api/todos/:id', (req, res, ctx) => {
    const body = req.body;
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(req.params.id),
        title: body.title,
        completed: body.completed,
        due_date: body.dueDate,
      })
    );
  }),
  rest.delete('/api/todos/:id', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ message: 'Todo deleted successfully', id: Number(req.params.id) }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App', () => {
  it('renders and loads todos', async () => {
    render(<App />);

    expect(screen.getByText('TODO Planner')).toBeInTheDocument();
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Prepare backlog')).toBeInTheDocument();
      expect(screen.getByText('Ship release notes')).toBeInTheDocument();
    });
  });

  it('creates a new todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument());

    await user.type(screen.getByRole('textbox', { name: /todo title/i }), 'Write docs');
    await user.type(screen.getByLabelText(/due date/i), '2026-08-15');
    await user.click(screen.getByRole('button', { name: 'Add Todo' }));

    await waitFor(() => {
      expect(screen.getByText('Todo created')).toBeInTheDocument();
    });
  });

  it('toggles completion status', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText('Prepare backlog')).toBeInTheDocument());
    await user.click(screen.getAllByRole('checkbox')[0]);

    await waitFor(() => {
      expect(screen.getByText('Todo status updated')).toBeInTheDocument();
    });
  });

  it('edits an existing todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText('Prepare backlog')).toBeInTheDocument());

    await user.click(screen.getByLabelText('Edit Prepare backlog'));
    await waitFor(() => expect(screen.getByRole('textbox', { name: /edit title/i })).toBeInTheDocument());
    await user.clear(screen.getByRole('textbox', { name: /edit title/i }));
    await user.type(screen.getByRole('textbox', { name: /edit title/i }), 'Prepare sprint backlog');
    await user.click(screen.getByLabelText('Save todo'));

    await waitFor(() => {
      expect(screen.getByText('Todo updated')).toBeInTheDocument();
    });
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText('Prepare backlog')).toBeInTheDocument());
    await user.click(screen.getByLabelText('Delete Prepare backlog'));

    await waitFor(() => {
      expect(screen.getByText('Todo deleted')).toBeInTheDocument();
    });
  });

  it('shows error state when loading fails', async () => {
    server.use(rest.get('/api/todos', (req, res, ctx) => res(ctx.status(500))));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load todos')).toBeInTheDocument();
    });
  });

  it('shows empty state when no todos are returned', async () => {
    server.use(rest.get('/api/todos', (req, res, ctx) => res(ctx.status(200), ctx.json([]))));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No todos yet. Add one to get started.')).toBeInTheDocument();
    });
  });
});
