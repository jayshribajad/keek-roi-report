const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  views: Number,
  content: String
});

const influencerSchema = new mongoose.Schema({
  name: String,
  followers: Number,
  posts: [postSchema]
});

module.exports = mongoose.model('Influencer', influencerSchema);
