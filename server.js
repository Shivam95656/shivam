// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'docs' directory
app.use(express.static('docs'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Handle player joining
    socket.on('join', (playerName) => {
        console.log(`${playerName} has joined the game`);
        socket.broadcast.emit('playerJoined', playerName);
    });

    // Handle player score
    socket.on('scoreUpdate', (score) => {
        socket.broadcast.emit('scoreUpdate', score);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
