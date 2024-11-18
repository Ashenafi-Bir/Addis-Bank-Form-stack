require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import the path module
const db = require('./models'); // Database models

// Import Routes
const formRoutes = require('./routes/forms');
const authRoutes = require('./routes/authRoutes');
const responseRoutes = require('./routes/responses');

// Initialize Express App
const app = express();

// Middleware
app.use(cors({ origin: '*', methods: 'GET,POST,PUT,DELETE' })); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Static File Serving (for frontend build)
app.use(express.static(path.join(__dirname, 'frontend/build')));

// API Routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/auth', authRoutes);

// Catch-All Handler for React Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Database Sync and Server Startup
const PORT = process.env.PORT || 5000; // Use PORT from .env or fallback to 5000
db.sequelize.sync()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running at http://0.0.0.0:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });
