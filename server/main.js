const path = require('path');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { origins: "localhost:* http://localhost:* http://127.0.0.1:*" });
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/x-www-form-urlencoded
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.setHeader('Content-Type', 'application/json')
    next();
});


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