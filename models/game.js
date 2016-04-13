let Board = require('./board');
let constants = require('./constants');

module.exports = class Game {
    constructor () {
        this.users = {};
        this.round = {};
        this.board = new Board();
    }

    startRound () {
        if (this.round.active)
            // TODO disallow beginning a new round while current round is active
            // return;
            this.round.targetSpace.token = null;

        this.round = {
            active: true,
            solnClaims: [],
            targetSpace: this.board.getRandomSpace('isValidTokenSpace')
        };

        let color;
        if (Math.random() < constants.RAINBOW_PERCENT)
            color = 'all';
        else
            color = constants.COLORS[Math.floor(Math.random() * constants.COLORS.length)];

        this.round.targetSpace.token = color;
    }
};
