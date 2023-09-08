const express = require('express');
const router = express.Router();
const playlistsCtrl = require('../controllers/playlists');

// GET /playlists
router.get('/', playlistsCtrl.index);
// GET /playlists/:id
router.get('/:id', playlistsCtrl.show);

module.exports = router;