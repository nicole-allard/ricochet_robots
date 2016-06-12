'use strict';

const Board = require('./board');
const constants = require('./constants');

module.exports = class Game {
    constructor () {
        this.users = {};
        this.round = {};
        this.board = new Board();
    }

    startRound () {
        if (this.round.active)
            // Allow users to kill current round and start a new one
            this.round.targetSpace.token = null;

        this.round = {
            active: true,
            solnClaims: [],
            targetSpace: this.board.getRandomSpace('isValidTokenSpace'),
        };

        let color;
        if (Math.random() < constants.RAINBOW_PERCENT)
            color = 'all';
        else
            color = constants.COLORS[Math.floor(Math.random() * constants.COLORS.length)];

        this.round.targetSpace.token = color;

        this.clearBids();
    }

    clearBids () {
        Object.keys(this.users).forEach(Function.bind.call(username => {
            this.users[username].bids = [];
        }, this));
    }

    newBid (username, bid, timestamp) {
        const user = this.users[username];
        if (!user)
            return;

        user.bids.push({ bid, timestamp });
    }
};
