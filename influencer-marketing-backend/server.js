// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Influencer = require('./models/influencers');
const Brand = require('./models/brands');
const Campaign = require('./models/campaigns');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/influencer-marketing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Get all influencers
app.get('/influencers', async (req, res) => {
  try {
    const influencers = await Influencer.find();
    res.json(influencers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get influencer by ID
app.get('/influencers/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all brands
app.get('/brands', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get brand by ID
app.get('/brands/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all campaigns
app.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get campaign by ID
app.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new influencer
app.post('/influencers', async (req, res) => {
  try {
    const influencer = new Influencer(req.body);
    await influencer.save();
    res.status(201).json(influencer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create new brand
app.post('/brands', async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create new campaign
app.post('/campaigns', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update influencer
app.put('/influencers/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndUpdate(req.params.id, req.body);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update brand
app.put('/brands/:id', async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update campaign
app.put('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete influencer
app.delete('/influencers/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndDelete(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json({ message: 'Influencer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete brand
app.delete('/brands/:id', async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete campaign
app.delete('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update influencer post views
app.put('/influencers/:influencerId/posts/:postId', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.influencerId);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }

    const post = influencer.posts.id(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.views = req.body.views;
    await influencer.save();

    res.json(influencer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get ROI data for a campaign
app.get('/campaigns/:campaignId/roi', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId).populate('influencers');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    let totalViews = 0;
    for (const influencer of campaign.influencers) {
      for (const post of influencer.posts) {
        totalViews += post.views;
      }
    }

    const roiData = {
      invested: campaign.budget,
      current: totalViews,
      totalReturn: (totalViews - campaign.budget) / campaign.budget * 100,
      oneDayReturn: (totalViews - campaign.budget) / (Date.now() - campaign.startDate) * 1000 * 60 * 60 * 24
    };

    res.json(roiData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});