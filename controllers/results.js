const Video = require('../models/videos');

let customData = []; // Change the variable name to match your usage

module.exports = {
    index,
    getCustomData: () => customData,
    setCustomData: (data) => {
        customData = data; // Update the variable name here as well
    }
};

async function index(req, res) {
    // console.log('OUTPUT');
    // console.log(customData); // Use the correct variable name
    res.render('results/index', { title: 'All search results', videos: customData }); // Use the correct variable name
}