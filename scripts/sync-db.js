const { sequelize } = require('../models')

require('../models/city') // city model path
require('../models/user') // user model path

async function run(){
  try {
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