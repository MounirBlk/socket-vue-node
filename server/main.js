const path = require('path');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server /*, { origins: "localhost:* http://localhost:* http://127.0.0.1:*" }*/ );
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const cors = require('cors');

app.use(cors({
    origin: true,
    credentials: true,
}));

mongoose.connect("mongodb://localhost:27017/socketChatApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const ChatSchema = mongoose.Schema({
    username: String,
    msg: String
});

const ChatModel = mongoose.model("chat", ChatSchema);

ChatModel.find((err, result) => {
    if (err) throw err;
    messages = result;
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'content-type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}))

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

let users = [];
let messages = [];

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
        let message = new ChatModel({
            username: socket.username,
            msg: msg
        });
        message.save((err, result) => {
            if (err) throw err;
            messages.push(result);
            io.emit('msg', result);
        });
    });

    //Disconnect
    socket.on("disconnect", () => {
        console.log(`${socket.username} has left the party.`);
        io.emit('userLeft', socket.username)
        users.splice(users.indexOf(socket), 1);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));