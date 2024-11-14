require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect:'mysql', 
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_USERNAME:', process.env.DB_USERNAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '*****' : 'Not set');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

