const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST']
  }
});

// Serve static files from the docs folder
app.use(express.static('docs'));

let scores = {};

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Listen for score updates from clients
  socket.on('scoreUpdate', (score) => {
    scores[socket.id] = score; // Store the score based on the socket id
    io.emit('updateScore', score); // Broadcast updated score to all clients
  });

  // Listen for game over event
  socket.on('gameOver', (score) => {
    console.log(`Game Over! Player Score: ${score}`);
    // Additional logic can be added here for game over
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
    delete scores[socket.id]; // Remove the score when the user disconnects
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
