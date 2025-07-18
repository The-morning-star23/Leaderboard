const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");

const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const claimRoutes = require('./routes/claimRoutes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/claim', claimRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Leaderboard API is running...');
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
