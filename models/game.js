let Board = require('./board');

module.exports = class Game {
    constructor () {
        this.users = {};
        this.board = new Board();
    }
};
