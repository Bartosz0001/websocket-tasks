const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '/client')));

const tasks = [];

const server = app.listen(8000, () => {
    console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client connected!');
    socket.emit('updateData', tasks);
    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
        console.log('task added');
    });
    socket.on('removeTask', (index) => {
        tasks.splice(index, 1);
        socket.broadcast.emit('removeTask', index);
    });
})