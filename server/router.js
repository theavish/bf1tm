var router = require('express').Router();
var jsonparser = require('body-parser').json();
var helpers = require('./helpers/routerHelpers');

router.get('/request-tag', jsonparser, helpers.handleRequestTag);
router.get('/request-stats', jsonparser, helpers.handleRequestStats);

module.exports = router;