const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models'); 
const formRoutes = require('./routes/forms');
const app = express();
const authRoutes = require('./routes/authRoutes');


app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', require('./routes/responses'));
app.use('/api/auth', authRoutes);


// Start the server
db.sequelize.sync().then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => {
    console.error('Failed to sync database:', err);
});
