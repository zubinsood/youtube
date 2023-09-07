const Video = require('../models/videos');
const User = require('../models/user');

let results = []; // Change the variable name to match your usage

module.exports = {
    index,
    watch,
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

async function watch(req, res) {
    const videoId = req.params.id;
    const video = results.find(v => v.videoId === videoId); // Corrected the arrow function

    if (video) {
        req.video = video;
        res.render('results/watch', { video });
    } else {
        res.status(404).send('Video not found');
    }
}