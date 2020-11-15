const path = require('path');
const express = require("express");
const http = require('http');
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

let users = [];
let message = [];
let index = 0;

io.on("connection", socket => {
    socket.emit('loggedIn', {
        users: users.map(s => s.username),
        messages: messages
    });

    socket.on('newuser', username => {
        console.log(`${username} has arrived at the party.`);
        socket.username = username;
        users.push(socket);

        io.emit('userOnline', socket.username);
    });

    socket.on('msg', msg => {
        let message = {
            index: index,
            username: socket.username,
            msg: msg
        }
        messages.push(message);
        io.emit('msg', message);
        index++;
    });

    //Disconnect
    socket.on("disconnect", () => {
        console.log(`${socket.username} has left the party.`);
        io.emit('userLeft', socket.username)
        users.splice(users.indexOf(socket), 1);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));