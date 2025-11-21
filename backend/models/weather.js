const { randomUUID } = require('crypto')

class weatherModel {
  constructor() {
    this.weathers = new Map()
  }

  validate(weather) {
    if (!weather) return { valid: false, error: 'Weather is required' }
    if (!weather.name || typeof weather.name !== 'string' || weather.name.trim() === '') {
      return { valid: false, error: 'Name is required and must be a non-empty string' }
    }
    if (!weather.description || typeof weather.description !== 'string') {
      return { valid: false, error: 'Description is required and must be a string' }
    }
    return { valid: true }
  }

  // data info weather id, weather name, and weather desc
  create({ name, description }) {
    const id = randomUUID()
    const newweather = { id, name, description }
    this.weathers.set(id, newweather)
    return newweather
  }

  list() {
    return Array.from(this.weathers.values())
  }

  get(id) {
    return this.weathers.get(id) || null
  }

  update(id, { name, description }) {
    const existing = this.weathers.get(id)
    if (!existing) return null
    const updated = { ...existing }
    if (name !== undefined) updated.name = name
    if (description !== undefined) updated.description = description
    this.weathers.set(id, updated)
    return updated
  }

  delete(id) {
    return this.weathers.delete(id)
  }
}

module.exports = new weatherModel()