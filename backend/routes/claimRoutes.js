const express = require('express');
const router = express.Router();
const User = require('../models/User');
const History = require('../models/History');

// Claim random points for a user
router.post('/', async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const points = Math.floor(Math.random() * 10) + 1;

    // Update user's total points
    user.totalPoints += points;
    await user.save();

    // Create history record
    const history = new History({
      user: user._id,
      points,
    });
    await history.save();

    res.json({ message: 'Points claimed', points, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get claim history (most recent first)
router.get('/history', async (req, res) => {
  try {
    const logs = await History.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const formatted = logs.map(log => ({
      user: log.user.name,
      points: log.points,
      timestamp: log.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
