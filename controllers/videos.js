const Video = require('../models/videos');

let customData = []; // Change the variable name to match your usage

module.exports = {
    index,
    watch,
    getCustomData: customData, // Use the variable directly, not an arrow function
    setCustomData: (data) => {
        customData = data; // Update the variable name here as well
    }
};

async function index(req, res) {
    // console.log('OUTPUT');
    // console.log(customData); // Use the correct variable name
    res.render('results/index', { title: 'All search results', videos: customData }); // Use the correct variable name
}

async function watch(req, res) {
    const videoId = req.params.id;
    const video = customData.find(v => v.videoId === videoId); // Corrected the arrow function

    if (video) {
        res.render('results/watch', { video });
    } else {
        res.status(404).send('Video not found');
    }
}