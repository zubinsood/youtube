const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  videos: [{
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);