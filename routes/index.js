// routes/index.js
const express = require('express');
const router = express.Router();
const Video = require('../models/videos'); // Adjust the path as needed
const resultsCtrl = require('../controllers/videos');
const results = require('../controllers/videos');

const token = process.env.YOUTUBE_TOKEN;
const ROOT_URL = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=date';

/* GET home page. */
router.get('/', async function(req, res, next) {
  const search = req.query.search;

  if (!search) {
    // Render the page without making an API request if no search query is provided
    return res.render('index', { videoData: [] });
  }

  try {
    const response = await fetch(`${ROOT_URL}&q=${search}&key=${token}`);
    if (response.ok) {
      const apiData = await response.json();
      const customData = apiData.items.map(item => {
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.default.url;
        const videoId = item.id.videoId;
        return new Video({ title, thumbnail, videoId });
      });
      resultsCtrl.setCustomData(customData);
      // Redirect to the /results route
      res.redirect('/results');
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error(error);
    // Handle the error and send an appropriate response to the client
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;