const request = require('supertest');
const { createApp } = require('../../src/app');

describe('TODO API Integration', () => {
  let appState;

  beforeEach(() => {
    appState = createApp({ dbPath: ':memory:' });
  });

  afterEach(() => {
    if (appState && appState.db && appState.db.open) {
      appState.close();
    }
  });

  it('creates and lists todos in required sorting order', async () => {
    const post = (payload) =>
      request(appState.app)
        .post('/api/todos')
        .send(payload)
        .set('Accept', 'application/json');

    const noDue = await post({ title: 'No due date' });
    expect(noDue.status).toBe(201);

    const later = await post({ title: 'Later due date', dueDate: '2026-12-01' });
    expect(later.status).toBe(201);

    const earlier = await post({ title: 'Earlier due date', dueDate: '2026-01-15' });
    expect(earlier.status).toBe(201);

    await request(appState.app).patch(`/api/todos/${later.body.id}/toggle`);

    const list = await request(appState.app).get('/api/todos');
    expect(list.status).toBe(200);

    expect(list.body.map((todo) => todo.title)).toEqual([
      'Earlier due date',
      'No due date',
      'Later due date',
    ]);
    expect(list.body[2].completed).toBe(true);
  });

  it('updates title and due date', async () => {
    const created = await request(appState.app)
      .post('/api/todos')
      .send({ title: 'Draft title' });

    const response = await request(appState.app)
      .put(`/api/todos/${created.body.id}`)
      .send({ title: 'Updated title', dueDate: '2027-03-10' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated title');
    expect(response.body.due_date).toBe('2027-03-10');
  });

  it('rejects invalid create payloads', async () => {
    const emptyTitle = await request(appState.app)
      .post('/api/todos')
      .send({ title: '' });

    expect(emptyTitle.status).toBe(400);
    expect(emptyTitle.body.error).toBe('Todo title is required');

    const badDate = await request(appState.app)
      .post('/api/todos')
      .send({ title: 'Valid', dueDate: '10-03-2027' });

    expect(badDate.status).toBe(400);
    expect(badDate.body.error).toBe('Due date must be a valid YYYY-MM-DD date');
  });

  it('deletes existing todos and returns not found on second delete', async () => {
    const created = await request(appState.app)
      .post('/api/todos')
      .send({ title: 'To remove' });

    const removed = await request(appState.app).delete(`/api/todos/${created.body.id}`);
    expect(removed.status).toBe(200);
    expect(removed.body).toEqual({ message: 'Todo deleted successfully', id: created.body.id });

    const missing = await request(appState.app).delete(`/api/todos/${created.body.id}`);
    expect(missing.status).toBe(404);
  });
});
