const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

// Define the Sequelize model
const City = sequelize.define('City', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'cities',
  timestamps: true,
});

module.exports = {

  Validate(city) {
    if (!city) return { valid: false, error: 'City is required' }
    if (!city.name || typeof city.name !== 'string' || city.name.trim() === '') {
      return { valid: false, error: 'Name is required and must be a non-empty string' }
    }
    if (!city.country || typeof city.country !== 'string') {
      return { valid: false, error: 'Country is required and must be a string' }
    }
    return { valid: true }
  },

  async Create({ name, country }) {
    const newCity = await City.create({ name, country });
    return newCity;
  },

  async Get(id) {
    const row = await City.findByPk(id);
    return row ? row.toJSON() : null;
  },

  async GetAll(sortBy = 'createdAt', sortOrder = 'DESC') {
    const rows = await City.findAll({ order: [[sortBy, sortOrder]] })
    return rows.map(r => r.toJSON())
  },

  async Update(id, { name, country }) {
    const row = await City.findByPk(id);
    if (!row) return null;
    if (name !== undefined) row.name = name;
    if (country !== undefined) row.country = country;
    await row.save();
    return row.toJSON();
  },

  async Delete(id) {
    return !!(await City.destroy({ where: { id } }))
  },

  Model: City,
};