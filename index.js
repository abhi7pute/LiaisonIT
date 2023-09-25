// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create an instance of Express
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Connect to MongoDB (replace 'mongodb://localhost/your_database_name' with your actual MongoDB URI)
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define the Task schema and model
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// Get all tasks
app.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new task
app.post('/tasks', async(req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Update a task by ID
app.put('/tasks/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = req.body;

        const task = await Task.findByIdAndUpdate(taskId, updatedTask, { new: true });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a task by ID
app.delete('/tasks/:id', async(req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findByIdAndRemove(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Express server
app.listen(4000, () => {
    console.log(`Server is running on port 4000`);
});