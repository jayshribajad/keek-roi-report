const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  budget: Number,
  startDate: Date,
  influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' }],
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }
});

module.exports = mongoose.model('Campaign', campaignSchema);
