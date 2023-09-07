const User = require('../models/user');
const Playlist = require('../models/playlists');

module.exports = {
    getPlaylists,
    createPlaylist
};

async function getPlaylists(req, res) {
    try {
        // Assuming you have authenticated the user and their ID is available in req.user.id
        const userId = req.user.id;

        // Retrieve the user's playlists from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const playlists = user.playlists;

        // Respond with the playlists data (e.g., send it as JSON)
        res.json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function createPlaylist(req, res) {
    const { title, description } = req.body;
    const currentUser = req.user; // Assuming you have middleware to populate this
    const currentVideo = req.video; // Assuming you have middleware to populate this

    // Create new playlist
    const newPlaylist = new Playlist({
        title,
        description,
        videos: [currentVideo.videoId]
    });

    await newPlaylist.save();

    // Update current user
    currentUser.playlists.push(newPlaylist._id);
    await currentUser.save();

    res.status(200).send("Playlist created");
}