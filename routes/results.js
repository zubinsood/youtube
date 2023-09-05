var express = require('express');
var router = express.Router();

const resultsCtrl = require('../controllers/results');

// GET /results
router.get('/', resultsCtrl.index);

module.exports = router;