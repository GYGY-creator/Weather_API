const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,

  // Hide password_hash from ALL queries by default
  defaultScope: {
    attributes: { exclude: ['password_hash'] },
  },

  // Allow explicitly requesting password_hash when needed (e.g. for login)
  scopes: {
    withPassword: {
      attributes: {},
    }
  }

});

module.exports = {

  Validate(user) {
    if (!user) return { valid: false, error: 'User is required' };
    if (!user.username || user.username.trim() === '') {
      return { valid: false, error: 'Username is required' };
    }
    if (!user.password_hash) {
      return { valid: false, error: 'Password hash is required' };
    }
    return { valid: true };
  },

  async Create({ username, password_hash, email }) {
    const newUser = await User.create({ username, password_hash, email });
    return newUser.toJSON();
  },

  async Get(id) {
    const row = await User.findByPk(id);
    if (!row) return null;
    return row.toJSON();
  },

  async GetAll(sortBy = 'createdAt', sortOrder = 'DESC') {
    const rows = await User.findAll({ order: [[sortBy, sortOrder]] });
    return rows.map(r => {
      return r.toJSON();
    });
  },

  async Update(id, updates) {
    const row = await User.findByPk(id);
    if (!row) return null;

    if (updates.username !== undefined) row.username = updates.username;
    if (updates.password_hash !== undefined) row.password_hash = updates.password_hash;
    if (updates.email !== undefined) row.email = updates.email;

    await row.save();
    return row.toJSON();
  },

  async Delete(id) {
    return !!(await User.destroy({ where: { id } }));
  },

  Model: User,
};