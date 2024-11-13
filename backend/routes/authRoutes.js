const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login successful', token });
    }
    console.error('Invalid credentials attempt:', { username });
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Server error on login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
