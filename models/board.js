const LAYOUT = [
    ['NW', 'N ', 'NE'],
    [' W', '  ', ' E'],
    ['SW', 'S ', 'SE']
];

const WIDTH = LAYOUT[0].length;
const HEIGHT = LAYOUT.length;

const COLORS = [
    'blue',
    'red',
    'green',
    'yellow'
];

module.exports = class Board {
    constructor () {
        // Build spaces array
        this.spaces = LAYOUT.map((row, y) => {
            return row.map((cell, x) => {
                return {
                    walls: cell.trim(),
                    coordinates: {
                        x: x,
                        y: y
                    }
                };
            });
        });

        // Randomize robot locations in spaces array
        COLORS.forEach((color) => {
            this.getRandomSpace().robot = color;
        }, this);
    }

    /**
     * Returns a random space on the board. Excludes spaces
     * with walls on all 4 sides, with a robot, or with a
     * token.
     * @return {Object} - The space object
     */
    getRandomSpace () {
        let space, x, y;
        do {
            x = Math.floor(Math.random() * WIDTH);
            y = Math.floor(Math.random() * HEIGHT);
            space = this.spaces[y][x];
        } while (space.robot || space.token || space.walls === 'NESW');

        console.log(space.coordinates);
        return space;
    }
};
