const express = require('express');
const db = require('./public/database');

const app = express();
const port = 3000;

//Add ability to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory task list
let tasks = [];

// API Endpoint to get all tasks
app.get('/tasks', (req, res) => {
  tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

// API Endpoint to add a new task
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (task) {
    db.prepare('INSERT INTO tasks (name, completed) VALUES (?,?)').run(task, 0);
    tasks.push({ id: tasks.length + 1, name: task, completed: false });
    res.status(201).json({ message: 'Task added successfully' });
  } else {
    res.status(400).json({ message: 'Task content is required' });
  }
});

// API Endpoint to delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  res.json({ message: 'Task deleted successfully' });
});

// API Endpoint to toggle task completion
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (task) {
    const updatedStatus = task.completed == 0 ? 1 : 0;
    db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(updatedStatus, taskId);
    res.json({ message: 'Task status updated successfully' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
