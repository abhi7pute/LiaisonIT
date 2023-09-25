document.addEventListener("DOMContentLoaded", () => {
    // Function to fetch tasks from the server and display them
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                const taskList = document.getElementById('taskList');
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <strong>${task.title}</strong><br>
                        ${task.description}<br>
                        <button onclick="deleteTask('${task._id}')">Delete</button>
                    `;
                    taskList.appendChild(listItem);
                });
            })
            .catch(error => console.error(error));
    }

    // Fetch tasks when the page loads
    fetchTasks();

    // Function to add a new task
    function addTask() {
        const taskTitle = document.getElementById('taskTitle').value;
        const taskDescription = document.getElementById('taskDescription').value;

        if (!taskTitle) {
            alert('Please enter a task title.');
            return;
        }

        fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDescription,
                    completed: false,
                }),
            })
            .then(response => response.json())
            .then(() => {
                // Clear input fields
                document.getElementById('taskTitle').value = '';
                document.getElementById('taskDescription').value = '';

                // Refresh the task list
                fetchTasks();
            })
            .catch(error => console.error(error));
    }

    // Function to delete a task
    function deleteTask(taskId) {
        fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(() => {
                // Refresh the task list
                fetchTasks();
            })
            .catch(error => console.error(error));
    }

    // Add task event listener
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
});