'use strict';

let path = require('path');

module.exports = {

  entry: path.join(__dirname, 'app/javascripts/main.js'),
  output: {
    path: path.join(__dirname, '/lib/scripts/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
    }]
  }
};
