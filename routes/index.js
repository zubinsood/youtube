// routes/index.js
const express = require('express');
const router = express.Router();
const Video = require('../models/videos'); // Adjust the path as needed
const resultsCtrl = require('../controllers/videos');
const passport = require('passport');

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
      const results = apiData.items.map(item => {
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.default.url;
        const videoId = item.id.videoId;
        const description = item.snippet.description;
        return new Video({ title, thumbnail, videoId, description });
      });
      resultsCtrl.setResults(results);
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

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  // Which passport strategy is being used?
  'google',
  {
    // Requesting the user's profile and email
    scope: ['profile', 'email'],
    // Optionally force pick account every time
    prompt: "select_account"
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});

module.exports = router;