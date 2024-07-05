const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: String,
  industry: String
});

module.exports = mongoose.model('Brand', brandSchema);
