const express = require('express');
const router = express.Router();
const User = require('../models/User');
const History = require('../models/History');
const avatarUpload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

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

// Get leaderboard (supports daily/monthly/overall)
router.get('/leaderboard', async (req, res) => {
  const { period } = req.query;

  let startDate = null;
  if (period === "daily") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "monthly") {
    startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }

  try {
    let leaderboard = [];

    if (startDate) {
      // Dynamic: use History to aggregate for the period
      const history = await History.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: "$user", totalPoints: { $sum: "$points" } } },
        { $sort: { totalPoints: -1 } }
      ]);

      const userIds = history.map(h => h._id);
      const userData = await User.find({ _id: { $in: userIds } }).lean();
      const userMap = Object.fromEntries(userData.map(u => [u._id.toString(), u]));

      leaderboard = history.map((entry, idx) => ({
        _id: entry._id,
        rank: idx + 1,
        name: userMap[entry._id.toString()]?.name || "Unknown",
        avatarUrl: userMap[entry._id.toString()]?.avatarUrl || null,
        totalPoints: entry.totalPoints
      }));
    } else {
      // Default: overall leaderboard using User.totalPoints
      const users = await User.find().sort({ totalPoints: -1 });
      leaderboard = users.map((user, idx) => ({
        _id: user._id,
        rank: idx + 1,
        name: user.name,
        avatarUrl: user.avatarUrl || null,
        totalPoints: user.totalPoints
      }));
    }

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user (name and/or avatar)
router.patch("/:id", avatarUpload.single("avatar"), async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.params.id;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateFields = {};
    if (name) updateFields.name = name;

    if (req.file) {
      // Delete old avatar file if exists
      if (existingUser.avatarUrl) {
        const oldAvatarPath = path.join(__dirname, "..", existingUser.avatarUrl);
        fs.unlink(oldAvatarPath, (err) => {
          if (err) console.warn("Failed to delete old avatar:", err.message);
        });
      }
      updateFields.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
