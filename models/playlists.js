const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videos: [{
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);