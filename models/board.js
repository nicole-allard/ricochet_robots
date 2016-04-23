'use strict';

let constants = require('./constants');
let Space = require('./space');

module.exports = class Board {
    constructor () {
        // Build spaces array
        this.spaces = constants.LAYOUT.map((row, y) => {
            return row.map((cell, x) => {
                return new Space({
                    walls: cell.replace(/\s/g, ''),
                    coordinates: {
                        x: x,
                        y: y
                    }
                });
            });
        });

        // Randomize robot locations in spaces array
        constants.COLORS.forEach((color) => {
            this.getRandomSpace('isValidRobotSpace').robot = color;
        }, this);
    }

    getRandomSpace (filter) {
        let validSpaces = this.spaces.reduce((existing, spaces) => {
            return existing.concat(spaces.filter((space) => {
                return space[filter].call(space);
            }));
        }, []);

        if (validSpaces.length)
            return validSpaces[Math.floor(Math.random() * validSpaces.length)];
    }
};
