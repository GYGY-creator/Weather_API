const {Sequelize} = require('sequelize');

// Database connection
const sequelize = new Sequelize('weather_api', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: console.log  // Shows SQL queries in console (helpful for learning)
});

// Add this function to automatically create database if it doesn't exist
async function createDatabase() {
  const sequelize_temp = new Sequelize('postgres', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false
  });
  
  try {
    await sequelize_temp.query('CREATE DATABASE weather_api;');
    console.log('Database created!');
  } catch (error) {
    console.log('Database probably already exists');
  }
  
  await sequelize_temp.close();
}

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully!');
  } catch (error) {
    console.error('Unable to connect to database:', error);
  }
}
// Main function that runs everything
async function main() {
  await createDatabase();    // Create database first
  await testConnection();    // Then test connection
}

// Call main function when file is run directly
if (require.main === module) {
  main();
}

module.exports = { sequelize, testConnection };