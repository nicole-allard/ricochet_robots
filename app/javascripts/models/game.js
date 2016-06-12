'use strict';

const Board = require('./board');
const constants = require('../constants');

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
            timeout: Infinity,
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

    newBid (username, bid, timestamp, onAcceptBid) {
        // Check for:
        //  valid user
        //  active round
        //  non-expired timer
        //  valid bid (greater than 1)
        const user = this.users[username];
        if (!user || !this.round.active || new Date().getTime() > this.round.timeout || bid < 2)
            return;

        if (Object.keys(this.users).every(Function.bind.call(username => {
            return !this.users[username].bids.length;
        }))) {
            // This is the first bid of this round. Start the timer.
            // TODO: handle timezones
            const time = 1000*10;
            this.round.timeout = new Date().getTime() + time;
            setTimeout(this.acceptBid.bind(this, onAcceptBid), time);
        }

        user.bids.push({ bid, timestamp });
    }

    acceptBid (onAcceptBid) {
        // Find the winning bid, that is the bid that is the lowest, ties broken
        // by timestamp. If bid is cancelled, move on to the next.

        let minBid = { bid: Infinity, timestamp: Infinity };
        let bidIsLower;
        Object.keys(this.users).forEach(Function.bind.call(username => {
            this.users[username].bids.forEach(bid => {
                bidIsLower = bid.bid < minBid.bid ||
                     (bid.bid === minBid.bid && bid.timestamp < minBid.timestamp);

                if (bid.status !== 'cancelled' && bidIsLower)
                    minBid = bid;
            });
        }, this));

        if (!minBid)
            return;

        minBid.status = 'accepted';
        onAcceptBid();
    }
};
