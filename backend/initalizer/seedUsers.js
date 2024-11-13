const sequelize = require('../config/dbConfig'); // Ensure this path is correct
const User = require('../models/User'); // Update with correct path
const bcrypt = require('bcrypt');

async function initializeUsers() {
  try {
    // Sync database and create table if it doesn't exist
    await sequelize.sync();

    // Hash the passwords before saving
    const hashedPassword1 = await bcrypt.hash('password1', 10);
    const hashedPassword2 = await bcrypt.hash('password2', 10);

    // Create users
    await User.bulkCreate([
      {
        firstName: 'Admin1',
        lastName: 'One1',
        username: 'admin12',
        password: hashedPassword1,
      },
      {
        firstName: 'Admin2',
        lastName: 'Two2',
        username: 'admin21',
        password: hashedPassword2,
      },
    ]);

    console.log('Admin users created successfully');
  } catch (error) {
    console.error('Error creating admin users:', error);
  } finally {
    await sequelize.close();
  }
}

initializeUsers();
