const User = require('../models/user');
const Playlist = require('../models/playlists');
const Video = require('../models/videos')

module.exports = {
    index,
    show,
    getPlaylists,
    createPlaylist,
    editPlaylist,
    deletePlaylist
};

async function index(req, res) {
    try {
        const playlists = await getPlaylists(req, res);
        if (playlists) {
            res.render('playlists/index', { playlists });
        } else {
            throw new Error('Playlists not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function getPlaylists(req, res) {
    console.log(req.user);
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const userId = req.user.id;
        const user = await User.findById(userId).populate('playlists');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return user.playlists;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function show(req, res) {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('videos');
        if (!playlist) {
            return res.status(404).send('Playlist not found');
        }
        console.log(playlist);
        res.render('playlists/show', { playlist });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function createPlaylist(req, res) {
    try {
        const title = req.body['playlist-title'];
        const description = req.body['playlist-description'];
        const currentUser = req.user; // Assuming you have middleware to populate this
        const videoData = req.video; // Assuming you have middleware to populate this

        // Check if the video already exists
        let video = await Video.findOne({ videoId: videoData.videoId });

        // If the video does not exist, create a new one
        if (!video) {
            video = new Video({
                title: videoData.title,
                thumbnail: videoData.thumbnail,
                videoId: videoData.videoId,
                description: videoData.description
            });

            await video.save();
        }

        // Create new playlist
        const newPlaylist = new Playlist({
            title,
            description,
            videos: [video._id]
        });

        await newPlaylist.save();

        // Update current user
        currentUser.playlists.push(newPlaylist._id);
        await currentUser.save();

        res.render('results/watch', { video });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function editPlaylist(req, res) {

}

async function deletePlaylist(req, res) {
    const currentUser = req.user;
    if (!currentUser) return res.redirect('/');
    currentUser.playlists.remove(req.params.id);
    await currentUser.save();
    res.redirect('/playlists');
}