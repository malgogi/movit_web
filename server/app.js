/**
 * Main application file
 */

'use strict';

import express from 'express';
import config from './config/environment';
import http from 'http';


// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);

//mongoose connect
var mongoose = require('mongoose');
mongoose.connect('mongodb://ec2-52-79-100-244.ap-northeast-2.compute.amazonaws.com');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;




