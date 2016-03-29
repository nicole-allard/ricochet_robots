/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// TODO: Move everything below into separate files
var game;
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
