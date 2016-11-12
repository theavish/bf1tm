const express = require('express');
const path = require('path');
const router = require('./router.js');

const app = express();
const port = process.env.PORT || 8080;
const clientDir = path.join(__dirname, '..', 'client');

app.use('/', express.static(clientDir));
app.use('/', router);


app.listen(port, () => { console.log('listening on', port) });