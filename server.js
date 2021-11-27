const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const Room = require('./room');
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res, next) => res.sendFile(__dirname + './index.html'));

var rooms = new Object();

io.on('connection', (socket) => {
  var roomid;

  socket.on('create game', () => {
    try {
      rooms[roomid].makeGame();
      var g = rooms[roomid].game;
      io.to(roomid).emit("game", {game: g.game, players: g.players, turn: g.turn});
      rooms[roomid].started = true;
    } catch {}
  });

  socket.on('add', (pos) => {
    try{
      var g = rooms[roomid].game;
      if (socket.id == g.players[g.turn].name) {
        g.add(JSON.parse(pos));
        io.to(roomid).emit("game", {game: g.game, players: g.players, turn: g.turn});
      }
    } catch {}
  });

  socket.on('create', (name) => {
    try {
      socket.join(name);
      roomid = name;
      rooms[name] = new Room(name);
      io.to(name).emit("joined", rooms[name].players);
    } catch {}
  });

  socket.on('join', (room) => {
    try{
      if (!rooms[room].started) {
        if (rooms[room].add(socket.id)) {
          socket.join(room);
          io.to(room).emit("joined", rooms[room].players);
          roomid = room;
        }
      }
    } catch {}
  });

  socket.once('disconnect', () => {
    try {
      if (rooms[roomid] !== undefined) {
        rooms[roomid].remove(socket.id);
        io.to(roomid).emit("joined", rooms[roomid].players);
        if (rooms[roomid].players.length==0) {
          delete rooms[roomid];
        }
      }
    } catch {}
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});