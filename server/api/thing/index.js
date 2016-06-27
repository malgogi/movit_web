'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/crawl', controller.crawl );
router.get('/search', controller.search );
router.get('/detail', controller.detail );
module.exports = router;
