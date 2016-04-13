'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let config = require('./common.js');

const isDev = process.env.NODE_ENV !== 'production';

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if (isDev) {
    let webpack = require('webpack');
    let webpackDevMiddleware = require('webpack-dev-middleware');
    let webpackConfig = require('./' + config.webpackConfig);
    let compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true }
    }));
} else {
    app.use(express.static(__dirname + '/lib'));
}

let Game = require('./models/game');
let game;

// TODO: Move everything below into separate files
app.get('/', function(request, response) {
    response.render('index');
});

io.on('connection', function (socket) {
    if (!game) {
        console.log('game created');
        game = new Game();
    }

    console.log('A new user connected!');
    socket.emit('game', game);

    socket.on('disconnect', function() {
        console.log('user disconnected');
        if (socket.username) {
            game.users[socket.username].status = 'disconnected';
            io.sockets.emit('game', game);
        }
    });

    socket.on('join', function (username) {
        socket.username = username;
        if (game.users[username] && game.users[username].status === 'connected')
            return void socket.emit('joinErr', `${username} is already taken. Please choose a new username`);

        game.users[username] = { username: username, status: 'connected' };
        socket.emit('joined', username);
        io.sockets.emit('game', game);
    });

    socket.on('newRound', () => {
        game.startRound();
        io.sockets.emit('game', game);
    });
});

http.listen(3000, function () {
    console.log('Join Express Server at http://localhost:3000/');
});
