const mongoose = require('mongoose');
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  videoId: { type: String, required: true },
  description: { type: String, required: false }
}, {
  timestamps: true
});

// Compile the schema into a model and export it
module.exports = mongoose.model('Video', videoSchema);