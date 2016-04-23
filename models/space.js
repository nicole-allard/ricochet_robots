'use strict';

let constants = require('./constants');

module.exports = class Space {
    constructor (options) {
        this.walls = options.walls;
        this.coordinates = options.coordinates;
        this.robot = options.robot;
        this.token = options.token;
    }

    isValidTokenSpace () {
        // Tokens can go in any space that has 2 walls
        // (a corner) that's not up against the edge of
        // the board.
        return !this.token && this.walls.length === 2 &&
            this.coordinates.x && this.coordinates.x !== constants.WIDTH-1 &&
            this.coordinates.y && this.coordinates.y !== constants.HEIGHT-1;
    }

    isValidRobotSpace () {
        return !this.robot && this.walls !== 'NESW';
    }
};
