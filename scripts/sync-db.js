const { sequelize } = require('../models')

require('../models/city') // city model path
require('../models/user') // user model path

async function run(){
  try {

    // create extension to make uuid_generate_v4 work
    await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    console.log('Syncing database...')
    await sequelize.sync({ alter: true })
    console.log('Database synced')
    process.exit(0)
  } catch (err) {
    console.error('Failed to sync DB', err)
    process.exit(1)
  }
}

run()
