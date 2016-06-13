'use strict';

const PORT = 3000;

const express = require('express');
const app = express();
const http = require('http').Server(app);  // eslint-disable-line new-cap
const io = require('socket.io')(http);

const config = require('./common.js');

const isDev = process.env.NODE_ENV !== 'production';

app.set('views', `${__dirname}/views`);
app.set('view engine', 'jade');

if (isDev) {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require(`./${config.webpackConfig}`);
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true },
    }));
} else {
    app.use(express.static(`${__dirname}/lib`));
}

const Game = require('./app/javascripts/models/game');
let game;

// TODO: Move everything below into separate files
app.get('/', (request, response) => {  // eslint-disable-line no-unused-vars
    response.render('index');
});

io.on('connection', socket => {
    if (!game) {
        console.log('game created');
        game = new Game();
    }

    console.log('A new user connected!');
    socket.emit('game', game);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (socket.username) {
            game.users[socket.username].status = 'disconnected';
            io.sockets.emit('game', game);
        }
    });

    socket.on('join', username => {
        socket.username = username;
        if (game.users[username] && game.users[username].status === 'connected')
            return void socket.emit('joinErr', `${username} is already taken. Please choose a new username`);

        game.users[username] = { username, status: 'connected' };
        socket.emit('joined', username);
        io.sockets.emit('game', game);
    });

    socket.on('newRound', () => {
        game.startRound();
        io.sockets.emit('game', game);
    });

    socket.on('bid', (bid, timestamp) => {
        game.newBid(socket.username, bid, timestamp, io.sockets.emit.bind(io.sockets, 'game', game));
        io.sockets.emit('game', game);
    });
});

http.listen(PORT, () => {
    console.log('Join Express Server at http://localhost:3000/');
});
