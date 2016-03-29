/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);  // this tells socket.io to use our express server

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
    response.render('login', {
        users: game.users
    });
});


console.log('Join Express Server at http://localhost:3000/');

io.sockets.on('connection', function (socket) {
    if (!game) {
        console.log('game created');
        game = { users: [] };
    }

    console.log('A new user connected!');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('info', function (data) { console.log('received a message from the browser: ' + data); });

    socket.on('join', function (username) {
        game.users.push(username);
        console.log('users: ' + game.users);
    });

    socket.emit('info', { msg: 'The world is round, there is no up or down.' });
});
