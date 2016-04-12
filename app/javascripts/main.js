'use strict';

let React = require('react');
let ReactDOM = require('react-dom');
let App = require('./app.js');

require('../stylesheets/style.scss');

ReactDOM.render(<App />, document.getElementById('content'));
