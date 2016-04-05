let env = require('./env.json');

module.exports = env[process.env.NODE_ENV || 'development'];
