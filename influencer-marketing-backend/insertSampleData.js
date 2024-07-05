const mongoose = require('mongoose');
const Influencer = require('./models/influencers');
const Brand = require('./models/brands');
const Campaign = require('./models/campaigns');

mongoose.connect('mongodb://localhost:27017/influencer-marketing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDatabase();
  })
  .then(() => {
    console.log('Database seeded successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB or seeding database:', err);
  });

async function seedDatabase() {
  // Clear existing data
  await Influencer.deleteMany({});
  await Brand.deleteMany({});
  await Campaign.deleteMany({});

  // Create sample influencers
  const influencer1 = new Influencer({
    name: 'John Doe',
    followers: 10000,
    posts: [
      { views: 5000, content: 'First post content' },
      { views: 7000, content: 'Second post content' }
    ]
  });

  const influencer2 = new Influencer({
    name: 'Jane Smith',
    followers: 20000,
    posts: [
      { views: 10000, content: 'First post content' },
      { views: 15000, content: 'Second post content' }
    ]
  });

  await influencer1.save();
  await influencer2.save();

  // Create sample brands
  const brand1 = new Brand({
    name: 'Tech Innovators',
    industry: 'Technology'
  });

  const brand2 = new Brand({
    name: 'Health Gurus',
    industry: 'Health'
  });

  await brand1.save();
  await brand2.save();

  // Create sample campaigns
  const campaign1 = new Campaign({
    name: 'Tech Launch',
    budget: 5000,
    startDate: new Date('2023-01-01'),
    influencers: [influencer1._id, influencer2._id],
    brand: brand1._id
  });

  const campaign2 = new Campaign({
    name: 'Health Awareness',
    budget: 8000,
    startDate: new Date('2023-02-01'),
    influencers: [influencer2._id],
    brand: brand2._id
  });

  await campaign1.save();
  await campaign2.save();
}
