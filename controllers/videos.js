const playlistsCtrl = require('../controllers/playlists');
const Video = require('../models/videos');
const User = require('../models/user');
const Playlist = require('../models/playlists');
const { getPlaylistByVideoId } = require('./playlists');

let results = []; // Change the variable name to match your usage

module.exports = {
    index,
    getVideoById,
    watch,
    populateVideo,
    getResults: results, // Use the variable directly, not an arrow function
    setResults: (result) => {
        results = result; // Update the variable name here as well
    }
};


async function index(req, res) {
    // console.log('OUTPUT');
    // console.log(Results); // Use the correct variable name
    res.render('results/index', { title: 'All search results', videos: results }); // Use the correct variable name
}

async function getVideoById(videoId) {
    // console.log("videoId from params: ", videoId);

    // First, try to find the video in the 'results' array
    let video = results.find(v => v.videoId === videoId);

    if (!video) {
        video = await Video.findOne({ "videoId": videoId });
        
        if (!video) return null;

        // Then, find the playlist that contains the video's _id
        const playlist = await Playlist.findOne({ "videos": video._id }).populate('videos');

        if (playlist && playlist.videos) {
            video = playlist.videos.find(v => v.videoId === videoId);
        }
    }

    return video;
}

async function watch(req, res) {
    const videoId = req.params.id;
    const video = results.find(v => v.videoId === videoId);
    
    // Populate the 'playlists' field for the user if the user is logged in
    if (req.user) {
        const populatedUser = await User.findById(req.user.id).populate({
            path: 'playlists',
            select: 'title' // Include any additional fields you need
        });
        
        req.user.playlists = populatedUser.playlists;
    }
    
    if (video) {
        req.video = video;
        res.render('results/watch', { video: req.video, user: req.user });
    } else if (!video) {
        // Populate the video and proceed.
        await populateVideo(req, res, async () => {
            // The video should now be available in req.video
            if (req.video) {
                res.render('results/watch', { video: req.video, user: req.user });
            } else {
                res.status(404).send('Video not found');
            }
        });
    } else {
        res.status(404).send('Video not found');
    }
}

// Existing middleware
function populateVideo(req, res, next) {
    const videoId = req.params.id;
    getVideoById(videoId).then(video => {
        if (video) {
            req.video = video;
            next();
        } else {
            res.status(404).send('Video not found');
        }
    });
}