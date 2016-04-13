const LAYOUT = [
    ['N  W', 'N   ', 'N   ', 'N   ', 'NE  ', 'N   ', 'N   ', 'N   ', 'N   ', 'N   ', 'NE  ', 'N   ', 'N   ', 'N   ', 'N   ', 'NE  '],
    ['   W', '    ', '    ', '    ', '    ', '    ', ' ES ', '    ', '    ', '  SW', '    ', '    ', '    ', '    ', '    ', ' E  '],
    ['   W', 'N  W', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', 'NE  ', ' E  '],
    ['   W', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', ' E  '],
    ['   W', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', ' ES ', '    ', '    ', '    ', '    ', ' ES '],
    ['  SW', '    ', '    ', '    ', '    ', '    ', 'NE  ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', ' E  '],
    ['   W', '    ', '    ', '  SW', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', 'N  W', '    ', '    ', ' E  '],
    ['   W', '    ', '    ', '    ', '    ', '    ', '    ', 'NESW', 'NESW', '    ', '    ', '    ', '    ', '    ', '    ', ' E  '],
    ['   W', '    ', '    ', '    ', '    ', '    ', '    ', 'NESW', 'NESW', '    ', '    ', '    ', '    ', '    ', '    ', ' E  '],
    ['   W', '    ', '    ', '    ', '  SW', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', ' ES '],
    ['  SW', '    ', '    ', '    ', '    ', '    ', 'N  W', '    ', ' ES ', '    ', '    ', '    ', '    ', '    ', '    ', ' E  '],
    ['   W', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', 'N  W', '    ', ' E  '],
    ['   W', '    ', '    ', '    ', '    ', '    ', '    ', 'NE  ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', ' E  '],
    ['   W', 'NE  ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '  SW', '    ', '    ', '    ', '    ', '    ', ' E  '],
    ['   W', '    ', '    ', ' ES ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', '    ', 'NE  ', ' E  '],
    ['  SW', '  S ', '  S ', '  S ', ' ES ', '  S ', '  S ', '  S ', '  S ', '  S ', '  S ', ' ES ', '  S ', '  S ', '  S ', ' ES ']
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
