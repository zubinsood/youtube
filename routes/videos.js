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
// POST 2 different actions
router.post('/:id', (req, res, next) => {
    // console.log('OPERATION:', req.body.operation);
    if (req.body.operation === 'create') {
        return playlistsCtrl.createPlaylist(req, res, next);
    } else if (req.body.operation === 'add') {
        return playlistsCtrl.addToPlaylist(req, res, next);
    } else {
        res.status(400).json({ success: false, message: 'Invalid operation' });
    }    
});

module.exports = router;