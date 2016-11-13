var express = require('express');
var path = require('path');
var router = require('./router.js');

var app = express();
var port = process.env.PORT || 8080;
var clientDir = path.join(__dirname, '..', 'client');

app.use('/', express.static(clientDir));
app.use('/', router);


app.listen(port, () => { console.log('listening on', port) });