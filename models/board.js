'use strict';

const constants = require('./constants');
const Space = require('./space');

module.exports = class Board {
    constructor () {
        // Build spaces array
        this.spaces = constants.LAYOUT.map((row, y) =>
            row.map((cell, x) =>
                new Space({
                    walls: cell.replace(/\s/g, ''),
                    coordinates: { x, y },
                })
            )
        );

        // Randomize robot locations in spaces array
        constants.COLORS.forEach(color => {
            this.getRandomSpace('isValidRobotSpace').robot = color;
        }, this);
    }

    getRandomSpace (filter) {
        const validSpaces = this.spaces.reduce((existing, spaces) =>
            existing.concat(spaces.filter(space =>
                space[filter]()
            ))
        , []);

        if (validSpaces.length)
            return validSpaces[Math.floor(Math.random() * validSpaces.length)];
    }
};
