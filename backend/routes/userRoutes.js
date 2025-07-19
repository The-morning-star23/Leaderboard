const express = require('express');
const router = express.Router();
const User = require('../models/User');
const avatarUpload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const History = require('../models/History');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new user
router.post('/', avatarUpload.single("avatar"), async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const newUser = new User({ 
      name,
      avatarUrl: req.file ? `/uploads/avatars/${req.file.filename}` : undefined, 
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get leaderboard (sorted by points)
router.get('/leaderboard', async (req, res) => {
  const { period } = req.query;

  let startDate;
  if (period === "daily") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "monthly") {
    startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }

  try {
    const users = await User.find();
    let leaderboard;

    if (startDate) {
      // Aggregate from History model
      const history = await History.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: "$user",
            totalPoints: { $sum: "$points" }
          }
        },
        {
          $sort: { totalPoints: -1 }
        }
      ]);

      // Map user IDs back to user data
      const userMap = await User.find({
        _id: { $in: history.map(h => h._id) }
      }).lean();

      const userMapObj = Object.fromEntries(userMap.map(u => [u._id.toString(), u]));

      leaderboard = history.map((entry, idx) => ({
        _id: entry._id,
        rank: idx + 1,
        name: userMapObj[entry._id.toString()]?.name || "Unknown",
        avatarUrl: userMapObj[entry._id.toString()]?.avatarUrl || null,
        totalPoints: entry.totalPoints
      }));
    } else {
      leaderboard = users
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((user, idx) => ({
          _id: user._id,
          rank: idx + 1,
          name: user.name,
          totalPoints: user.totalPoints,
          avatarUrl: user.avatarUrl || null
        }));
    }

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", avatarUpload.single("avatar"), async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.params.id;

    // Fetch existing user to get old avatar
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateFields = {};
    if (name) updateFields.name = name;

    if (req.file) {
      // Delete old avatar if it exists
      if (existingUser.avatarUrl) {
        const oldAvatarPath = path.join(__dirname, "..", existingUser.avatarUrl);
        fs.unlink(oldAvatarPath, (err) => {
          if (err) {
            console.warn("Old avatar delete failed:", err.message);
          }
        });
      }
      updateFields.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
