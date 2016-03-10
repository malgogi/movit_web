'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/crawl', controller.crawl );
router.get('/search', controller.search );
module.exports = router;
