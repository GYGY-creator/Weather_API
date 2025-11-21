const { randomUUID } = require('crypto')

class userModel {
  constructor() {
    this.users = new Map()
  }

  validate(user) {
    if (!user) return { valid: false, error: 'User is required' }
    if (!user.name || typeof user.name !== 'string' || user.name.trim() === '') {
      return { valid: false, error: 'Name is required and must be a non-empty string' }
    }
    if (!user.description || typeof user.description !== 'string') {
      return { valid: false, error: 'Description is required and must be a string' }
    }
    return { valid: true }
  }

  create({ name, description }) {
    const id = randomUUID()
    const newuser = { id, name, description }
    this.users.set(id, newuser)
    return newuser
  }

  list() {
    return Array.from(this.users.values())
  }

  get(id) {
    return this.users.get(id) || null
  }

  update(id, { name, description }) {
    const existing = this.users.get(id)
    if (!existing) return null
    const updated = { ...existing }
    if (name !== undefined) updated.name = name
    if (description !== undefined) updated.description = description
    this.users.set(id, updated)
    return updated
  }

  delete(id) {
    return this.users.delete(id)
  }
}

module.exports = new userModel()