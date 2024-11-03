// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = {}; // Object to store players' scores and names

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  // Handle new player joining
  socket.on('newPlayer', (playerName) => {
    players[socket.id] = { name: playerName, score: 0 };
    console.log(`${playerName} joined the game`);
    io.emit('updatePlayers', players); // Notify all clients of the updated player list
  });

  // Handle score updates
  socket.on('scoreUpdate', (score) => {
    if (players[socket.id]) {
      players[socket.id].score = score;
    }
    io.emit('updatePlayers', players); // Broadcast updated scores
  });

  // Handle game over
  socket.on('gameOver', () => {
    const playerScores = Object.values(players);
    if (playerScores.length === 2) {
      const winner =
        playerScores[0].score > playerScores[1].score
          ? playerScores[0].name
          : playerScores[1].name;
      io.emit('gameResult', { players: playerScores, winner });
      console.log(`Game over! Winner: ${winner}`);
    }
  });

  // Handle player disconnect
  socket.on('disconnect', () => {
    delete players[socket.id];
    console.log('A player disconnected:', socket.id);
    io.emit('updatePlayers', players); // Update player list on disconnect
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
