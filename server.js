const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
let tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', () => {
  socket.emit('updateData', tasks);
  socket.on('addTask', (newTask) => {
    tasks.push(newTask);
    socket.broadcast.emit('addTask', newTask);
  });
  socket.on('removeTask', (taskId) => {
    tasks.splice(taskId);
    socket.broadcast.emit('removeTask', taskId);
  });
}); 
