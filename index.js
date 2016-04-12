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

// TODO: Move everything below into separate files
let game;
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
            socket.emit('game', game);
        }
    });

    socket.on('join', function (username) {
        socket.username = username;
        game.users[username] = { username: username, status: 'connected' };
        socket.emit('game', game);
    });
});

http.listen(3000, function () {
    console.log('Join Express Server at http://localhost:3000/');
});
