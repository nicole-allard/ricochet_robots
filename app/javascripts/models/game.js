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
            bids: [],
        };

        let color;
        if (Math.random() < constants.RAINBOW_PERCENT)
            color = 'all';
        else
            color = constants.COLORS[Math.floor(Math.random() * constants.COLORS.length)];

        this.round.targetSpace.token = color;
    }

    newBid (username, bid, timestamp, onAcceptBid) {
        // Check for:
        //  active round
        //  non-expired timer
        //  valid bid (greater than 1)
        if (!this.round.active || new Date().getTime() > this.round.timeout || bid < 2)
            return;

        if (!this.round.bids.length) {
            // This is the first bid of this round. Start the timer.
            // TODO: handle timezones
            const time = 1000*10;
            this.round.timeout = new Date().getTime() + time;
            setTimeout(this.acceptBid.bind(this, onAcceptBid), time);
        }

        this.insertBid(this.round.bids, { username, bid, timestamp });
    }

    insertBid (bids, bid) {
        let i;
        for (i = 0; i < bids.length; i++) {
            if (bids[i].bid > bid.bid ||
                (bids[i].bid === bid.bid && bids[i].timestamp > bid.timestamp))
                return;
        }

        this.round.bids.splice(i, 0, bid);
    }

    acceptBid (onAcceptBid) {
        let i;
        for (i = 0; i < this.round.bids.length; i++) {
            if (this.round.bids[i].status !== 'cancelled')
                return;
        }

        Object.assign(this.round.bids[i], {
            status: 'accepted',
            moves: [],
        });
        onAcceptBid();
    }
};
