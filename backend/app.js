require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models'); 
const formRoutes = require('./routes/forms');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', require('./routes/responses'));
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from .env or fallback to 5000
db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to sync database:', err);
});
