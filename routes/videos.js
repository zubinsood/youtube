var express = require('express');
var router = express.Router();

const videosCtrl = require('../controllers/videos');

// GET /results
router.get('/', videosCtrl.index);
// GET /watch/:id
router.get('/:id', videosCtrl.watch)

module.exports = router;