const { DataTypes } = require('sequelize');
const { sequelize } = require('../_database_connection_test');

// Define the Sequelize model
const Weather = sequelize.define('Weather', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'weathers',
  timestamps: true,
});

module.exports = {

  Validate(weathers) {
    if (!weathers) return { valid: false, error: 'Weather is required' }
    if (!weathers.name || typeof weathers.name !== 'string' || weathers.name.trim() === '') {
      return { valid: false, error: 'Name is required and must be a non-empty string' }
    }
    if (!weathers.description || typeof weathers.description !== 'string') {
      return { valid: false, error: 'Description is required and must be a string' }
    }
    return { valid: true }
  },

  async Create({ name, description }) {
    const newWeather = await Weather.create({ name, description });
    return newWeather;
  },

  async Get(id) {
    const row = await Weather.findByPk(id);
    return row ? row.toJSON() : null;
  },

  async GetAll(sortBy = 'createdAt', sortOrder = 'DESC') {
    const rows = await Weather.findAll({ order: [[sortBy, sortOrder]] })
    return rows.map(r => r.toJSON())
  },

  async Update(id, { name, description }) {
    const row = await Weather.findByPk(id);
    if (!row) return null;
    if (name !== undefined) row.name = name;
    if (description !== undefined) row.description = description;
    await row.save();
    return row.toJSON();
  },

  async Delete(id) {
    return !!(await Weather.destroy({ where: { id } }))
  },

  Model: Weather,
};