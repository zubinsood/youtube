const express = require('express');
const router = express.Router();
const playlistsCtrl = require('../controllers/playlists');

// GET /playlists
router.get('/', playlistsCtrl.index);
// GET /playlists/:id
router.get('/:id', playlistsCtrl.show);
// POST /playlists/:id for EDITING/UPDATING
router.post('/:id', playlistsCtrl.editPlaylist);
// DELETE video from playlist
router.delete('/:playlistId/videos/:videoId', playlistsCtrl.deleteVideoFromPlaylist);
// DELETE playlist
router.delete('/:playlistId', playlistsCtrl.deletePlaylist);  

module.exports = router;