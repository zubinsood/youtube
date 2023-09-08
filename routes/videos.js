var express = require('express');
var router = express.Router();

const videosCtrl = require('../controllers/videos');
const playlistsCtrl = require('../controllers/playlists');

// GET /results
router.get('/', videosCtrl.index);
// Middleware added here will apply to all routes that come after it and share its path pattern
router.use('/:id', videosCtrl.populateVideo);
// GET /watch/:id
router.get('/:id', videosCtrl.watch);
// POST /watch/:id
router.post('/:id', playlistsCtrl.createPlaylist);

module.exports = router;