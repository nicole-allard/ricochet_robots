'use strict';

let path = require('path');

module.exports = {

  // Gives you sourcemaps without slowing down rebundling
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'app/javascripts/main.js')
  ],
  output: {
    path: '/',
    publicPath: 'http://localhost:3000/scripts/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
        test: /\.css$/,
        loader: 'style!css'
    }]
  }
};
