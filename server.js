const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const allClients = new WeakMap();

// handle incoming connections from clients
io.on('connection', socket => {
  // Client has joined a room
  socket.on('join game', data => {
    socket.join(data.gameCode);
    allClients.set(socket, data);
    io.sockets.in(data.gameCode).emit('player joined game', data);
  });

  // Client has sent generic event
  socket.on('socket/WS_EVENT', (code, data) => {
    io.sockets.in(code).emit('event', data);
  });

  // Client has disconnected
  socket.on('disconnect', () => {
    const client = allClients.get(socket);
    // Return if player hasn't joined a room yet
    if (client === undefined) {
      return;
    }
    io.sockets.in(client.gameCode).emit('player left game', client);
    allClients.delete(socket);
  });
});
