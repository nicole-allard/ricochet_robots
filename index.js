'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/lib'));

// TODO: Move everything below into separate files
let game;
app.get('/', function(request, response) {
    response.render('index', {
        game: game
    });
});


io.on('connection', function (socket) {
    if (!game) {
        console.log('game created');
        game = { users: {} };
    }

    console.log('A new user connected!');
    socket.emit('game', game);

    socket.on('disconnect', function() {
        console.log('user disconnected');
        if (socket.username) {
            game.users[socket.username].status = 'disconnected';
            io.emit('game', game);
        }
    });

    socket.on('join', function (username) {
        socket.username = username;
        game.users[username] = { username: username, status: 'connected' };
        io.emit('game', game);
    });
});

http.listen(3000, function () {
    console.log('Join Express Server at http://localhost:3000/');
});
