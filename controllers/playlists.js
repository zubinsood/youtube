const User = require('../models/user');
const Playlist = require('../models/playlists');
const Video = require('../models/videos')

module.exports = {
    index,
    show,
    getPlaylists,
    createPlaylist,
    addToPlaylist,
    editPlaylist,
    deletePlaylist,
    deleteVideoFromPlaylist
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

async function addToPlaylist(req, res) {
    console.log('add to palylist')
    try {
        console.log('req video', req.video);
        const playlistId = req.body['playlist-id']; // Assuming you send the playlist ID in the request
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

        // Find the playlist by ID
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).send('Playlist not found');
        }

        // Check if the video is already in the playlist
        if (!playlist.videos.includes(video._id)) {
            // Add the video to the playlist
            playlist.videos.push(video._id);
            await playlist.save();
        } else {
            return res.status(400).send('Video already exists in the playlist');
        }

        res.json({ success: true, message: 'Video added to playlist' });
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function editPlaylist(req, res) {
    try {
        const id = req.params.id;
        const { title, description } = req.body;
        const playlist = await Playlist.findById(id);
        
        if (playlist) {
            playlist.title = title;
            playlist.description = description;
            await playlist.save();
            
            res.redirect(`/playlists/${id}`);
        } else {
            res.status(404).send('Playlist not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function deletePlaylist(req, res) {
    try {
        const { playlistId } = req.params;
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const playlist = await Playlist.findByIdAndDelete(playlistId);
        
        if (!playlist) {
            return res.status(404).send("Playlist not found");
        }
        
        // Remove videos from database
        for (const videoId of playlist.videos) {
            await Video.findByIdAndDelete(videoId);
        }
    
        // Remove playlist from user's playlists array
        const index = user.playlists.indexOf(playlistId);
        if (index > -1) {
            user.playlists.splice(index, 1);
            await user.save();
        }
    
        res.redirect('/playlists');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

async function deleteVideoFromPlaylist(req, res) {
    try {
        const { playlistId, videoId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const playlist = await Playlist.findById(playlistId);
        
        if (!playlist || !user.playlists.includes(playlistId.toString())) {
            return res.status(404).send("Playlist not found");
        }
        
        const videoIndex = playlist.videos.indexOf(videoId);
        if (videoIndex > -1) {
            playlist.videos.splice(videoIndex, 1);
            await playlist.save();
            
            // Delete the video from the database
            await Video.findByIdAndDelete(videoId);
        } else {
            return res.status(404).send("Video not found in playlist");
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}