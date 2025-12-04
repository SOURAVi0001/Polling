const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');
const registerPollSocket = require('./sockets/pollSocket');
const pollsRouter = require('./routes/polls');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: config.CLIENT_URL }));
app.use(express.json());

app.use('/api/polls', pollsRouter);

mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    registerPollSocket(io);

    server.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch(err => {
    console.log('❌ MongoDB Connection Error:', err);
    process.exit(1); 
  });

