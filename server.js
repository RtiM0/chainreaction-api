const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const game = require('./game');
const io = new Server(server);

app.use(express.static(path.join(__dirname,'build')));
app.get('/', (req, res, next) => res.sendFile(__dirname+'./index.html'));

io.on('connection',(socket) => {
  console.log(`Connected ${socket.id}`);
  var g;
  socket.on('options',(options)=> {
    g = new game(options);
  });
  socket.on('pos', (pos)=> {
    g.add(JSON.parse(pos));
    socket.emit('game',{game:g.game,players:g.players,turn:g.turn});
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});