'use strict';

let path = require('path');
let base = require('./webpack.config.js');

module.exports = Object.assign({}, base, {

  // Gives you sourcemaps without slowing down rebundling
  devtool: 'source-map',
  output: {
    path: '/',
    publicPath: 'http://localhost:3000/scripts/',
    filename: 'bundle.js'
  }
});
