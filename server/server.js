const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

let connectedUsers = {};

function onlineChange() {
  const online = Object.keys(connectedUsers).length;
  io.emit('online', online);
};

io.on('connection', (socket) => {
  const { id } = socket;
  connectedUsers[id] = socket;
  onlineChange();
  
  socket.on('sendMsg', (msg) => {
    let sends = 0;
    for (const recieverId in connectedUsers) {
      if(connectedUsers.hasOwnProperty(recieverId)) {
        // Not sending msg to sender
        if (id === recieverId) {
          continue;
        }
        connectedUsers[recieverId].emit('newMsg', msg);
        sends ++;
      };
    };
    console.log(`Sended to ${sends} users.`);
  });

  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
    onlineChange();
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});