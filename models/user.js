const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  avatar: String,
  playlists: [{
    type: Schema.Types.ObjectId,
    ref: 'Playlists'
  }]
}, {
  timestamps: true
});


module.exports = mongoose.model('User', userSchema);