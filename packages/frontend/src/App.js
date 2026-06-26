import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a7ea4',
    },
    secondary: {
      main: '#ff7f50',
    },
    error: {
      main: '#b00020',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const isDateValueValid = (value) => {
  if (!value) {
    return true;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const addDisabled = useMemo(
    () => isSubmitting || newTitle.trim() === '' || !isDateValueValid(newDueDate),
    [isSubmitting, newDueDate, newTitle]
  );

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('Failed to load todos');
      }

      const result = await response.json();
      setTodos(result);
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreateTodo = async (event) => {
    event.preventDefault();

    if (addDisabled) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          dueDate: newDueDate || null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Failed to create todo');
      }

      setNewTitle('');
      setNewDueDate('');
      setStatusMessage('Todo created');
      await loadTodos();
    } catch (createError) {
      setError(createError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const response = await fetch(`/api/todos/${todoId}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }

      setStatusMessage('Todo status updated');
      await loadTodos();
    } catch (toggleError) {
      setError(toggleError.message);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setStatusMessage('Todo deleted');
      await loadTodos();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const startEditing = (todo) => {
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
    setEditDueDate(todo.due_date || '');
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditTitle('');
    setEditDueDate('');
  };

  const handleSaveEdit = async (todo) => {
    if (editTitle.trim() === '' || !isDateValueValid(editDueDate)) {
      return;
    }

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          dueDate: editDueDate || null,
          completed: Boolean(todo.completed),
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Failed to save todo changes');
      }

      cancelEditing();
      setStatusMessage('Todo updated');
      await loadTodos();
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="app-shell">
        <Container maxWidth="md">
          <Paper elevation={3} className="app-panel">
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  TODO Planner
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Organize tasks by due date and completion status.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleCreateTodo}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    required
                    label="Todo title"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    slotProps={{ htmlInput: { 'aria-label': 'Todo title' } }}
                  />
                  <TextField
                    label="Due date"
                    type="date"
                    value={newDueDate}
                    onChange={(event) => setNewDueDate(event.target.value)}
                    error={!isDateValueValid(newDueDate)}
                    helperText={!isDateValueValid(newDueDate) ? 'Enter a valid date.' : ' '}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{ htmlInput: { 'aria-label': 'Due date' } }}
                  />
                  <Button type="submit" variant="contained" disabled={addDisabled}>
                    Add Todo
                  </Button>
                </Stack>
              </Box>

              {loading ? (
                <Box className="loading-container" aria-live="polite">
                  <CircularProgress size={28} />
                  <Typography variant="body2">Loading todos...</Typography>
                </Box>
              ) : todos.length === 0 ? (
                <Alert severity="info">No todos yet. Add one to get started.</Alert>
              ) : (
                <List aria-label="Todo list">
                  {todos.map((todo) => {
                    const isEditing = editingTodoId === todo.id;
                    return (
                      <ListItem
                        key={todo.id}
                        className="todo-item"
                        secondaryAction={
                          <Stack direction="row" spacing={1}>
                            {isEditing ? (
                              <>
                                <IconButton
                                  aria-label="Save todo"
                                  color="primary"
                                  onClick={() => handleSaveEdit(todo)}
                                  disabled={editTitle.trim() === '' || !isDateValueValid(editDueDate)}
                                >
                                  <SaveIcon />
                                </IconButton>
                                <IconButton aria-label="Cancel editing" onClick={cancelEditing}>
                                  <CloseIcon />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  aria-label={`Edit ${todo.title}`}
                                  onClick={() => startEditing(todo)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  aria-label={`Delete ${todo.title}`}
                                  color="error"
                                  onClick={() => handleDeleteTodo(todo.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </Stack>
                        }
                      >
                        <Checkbox
                          checked={Boolean(todo.completed)}
                          onChange={() => handleToggleTodo(todo.id)}
                          aria-label={`Mark ${todo.title} as complete`}
                        />

                        {isEditing ? (
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            className="edit-stack"
                          >
                            <TextField
                              fullWidth
                              required
                              label="Edit title"
                              value={editTitle}
                              onChange={(event) => setEditTitle(event.target.value)}
                              slotProps={{ htmlInput: { 'aria-label': 'Edit title' } }}
                            />
                            <TextField
                              label="Edit due date"
                              type="date"
                              value={editDueDate}
                              onChange={(event) => setEditDueDate(event.target.value)}
                              error={!isDateValueValid(editDueDate)}
                              helperText={!isDateValueValid(editDueDate) ? 'Enter a valid date.' : ' '}
                              InputLabelProps={{ shrink: true }}
                              slotProps={{ htmlInput: { 'aria-label': 'Edit due date' } }}
                            />
                          </Stack>
                        ) : (
                          <ListItemText
                            primary={todo.title}
                            secondary={todo.due_date ? `Due: ${todo.due_date}` : 'No due date'}
                            primaryTypographyProps={{
                              sx: {
                                textDecoration: todo.completed ? 'line-through' : 'none',
                              },
                            }}
                          />
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Stack>
          </Paper>
        </Container>

        <Snackbar
          open={statusMessage !== ''}
          autoHideDuration={2000}
          onClose={() => setStatusMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setStatusMessage('')} sx={{ width: '100%' }}>
            {statusMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={error !== ''}
          autoHideDuration={3000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
