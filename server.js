const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

const tasks = [];

const server = app.listen(8000, () => {
    console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);
io.set('transports', [ 'websocket' ]);

io.on('connection', (socket) => {
    socket.emit('updateData', tasks);
    socket.on('addTask', (task) => {
        tasks.push({id: task.id, name: task.name});
        socket.broadcast.emit('addTask', task);
    });
    socket.on('removeTask', (index) => {
        tasks.splice(index, 1);
        socket.broadcast.emit('removeTask', index);
    });
})