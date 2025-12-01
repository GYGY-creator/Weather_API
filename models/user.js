const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

// Define the Sequelize model
const User = sequelize.define('User', {
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
  tableName: 'users',
  timestamps: true,
});

module.exports = {

  Validate(user) {
    if (!user) return { valid: false, error: 'User is required' }
    if (!user.name || typeof user.name !== 'string' || user.name.trim() === '') {
      return { valid: false, error: 'Name is required and must be a non-empty string' }
    }
    if (!user.description || typeof user.description !== 'string') {
      return { valid: false, error: 'Description is required and must be a string' }
    }
    return { valid: true }
  },

  async Create({ name, description }) {
    const newUser = await User.create({ name, description });
    return newUser;
  },

  async Get(id) {
    const row = await User.findByPk(id);
    return row ? row.toJSON() : null;
  },

  async GetAll(sortBy = 'createdAt', sortOrder = 'DESC') {
    const rows = await User.findAll({ order: [[sortBy, sortOrder]] })
    return rows.map(r => r.toJSON())
  },

  async Update(id, { name, description }) {
    const row = await User.findByPk(id);
    if (!row) return null;
    if (name !== undefined) row.name = name;
    if (description !== undefined) row.description = description;
    await row.save();
    return row.toJSON();
  },

  async Delete(id) {
    return !!(await User.destroy({ where: { id } }))
  },

  Model: User,
};