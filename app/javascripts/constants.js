'use strict';

const SECOND_MS = 1000;
const TIMER_LENGTH_S = 10;

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
    ['  SW', '  S ', '  S ', '  S ', ' ES ', '  S ', '  S ', '  S ', '  S ', '  S ', '  S ', ' ES ', '  S ', '  S ', '  S ', ' ES '],
];

const COLORS = [
    'blue',
    'red',
    'green',
    'yellow',
];

const DIRECTIONS = {
    W: 37,
    N: 38,
    E: 39,
    S: 40,
};

module.exports = {
    AUTH_COOKIE: 'rr-auth',

    LAYOUT,
    WIDTH: LAYOUT[0].length,
    HEIGHT: LAYOUT.length,
    COLORS,
    RAINBOW_PERCENT: 0.0625,  // 1/16 chance of generating a rainbow token
    TIMER_LENGTH: SECOND_MS * TIMER_LENGTH_S,

    HOTKEYS: Object.assign({
        // TODO: figure out why '+'.chatCodeAt is incorrect
        187: ['updateNumMoves', 1],  // +
        189: ['updateNumMoves', -1],  // -
        13: ['submitBid'],  // enter
    },
    COLORS.reduce((result, color) =>
        Object.assign(result, {
            [color.toLowerCase().charCodeAt(0)]: ['switchColor', color],
            [color.toUpperCase().charCodeAt(0)]: ['switchColor', color],
        }), {}),
    Object.keys(DIRECTIONS).reduce((result, dir) =>
        Object.assign(result, {
            [DIRECTIONS[dir]]: ['move', dir],
        }), {})
    ),
};
