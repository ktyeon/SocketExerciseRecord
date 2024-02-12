// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fitness_tracker', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define MongoDB schema and model
const userSchema = new mongoose.Schema({
  username: String,
  exerciseRecord: Number
});
const User = mongoose.model('User', userSchema);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle exercise record entry
  socket.on('exerciseRecord', async (data) => {
    console.log(`Received exercise record from user ${data.username}: ${data.exerciseRecord}`);
    // Save or update user's exercise record in MongoDB
    let user = await User.findOne({ username: data.username });
    if (!user) {
      user = new User({ username: data.username, exerciseRecord: 0 });
    }
    user.exerciseRecord = data.exerciseRecord;
    await user.save();
  });

  // Handle request for iPhone user's circle graph
  socket.on('requestGraph', async (data) => {
    console.log(`Received request for graph from user ${data.username}`);
    // Retrieve iPhone user's exercise record from MongoDB
    const user = await User.findOne({ username: data.username });
    if (user) {
      // Send iPhone user's exercise record to Apple Watch
      io.to(socket.id).emit('graphData', { exerciseRecord: user.exerciseRecord });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
