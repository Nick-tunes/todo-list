document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  // Fetch and display tasks
  const fetchTasks = async () => {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = task.completed ? 'completed' : '';
      li.innerHTML = `
        <input type="checkbox" class="toggle-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.name}</span>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      `;
      taskList.appendChild(li);
    });
  };

  fetchTasks();

  // Add a new task
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    if (task) {
      await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task })
      });
      taskInput.value = '';
      fetchTasks();
    }
  });

  // Handle task actions (toggle, delete)
  taskList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.getAttribute('data-id');
      await fetch(`/tasks/${id}`, {
        method: 'DELETE'
      });
      fetchTasks();
    } else if (e.target.classList.contains('toggle-checkbox')) {
      const id = e.target.getAttribute('data-id');
      await fetch(`/tasks/${id}`, {
        method: 'PUT'
      });
      fetchTasks();
    }
  });
});
