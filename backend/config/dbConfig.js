const { Sequelize } = require('sequelize');
const mysql = require('mysql2');

const dbName = 'addis_form';
const username = 'root';
const password = 'Ahuu@2112';
const host = 'localhost';

const sequelize = new Sequelize(dbName, username, password, {
  host: host,
  dialect: 'mysql',
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; // Ensure this is at the end
