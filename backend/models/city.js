const { randomUUID } = require('crypto')

class cityModel {
  constructor() {
    this.cities = new Map()
  }

  validate(city) {
    if (!city) return { valid: false, error: 'City is required' }
    if (!city.name || typeof city.name !== 'string' || city.name.trim() === '') {
      return { valid: false, error: 'Name is required and must be a non-empty string' }
    }
    if (!city.country || typeof city.country !== 'string') {
      return { valid: false, error: 'Country is required and must be a string' }
    }
    return { valid: true }
  }

  create({ name, country }) {
    const id = randomUUID()
    const newCity = { id, name, country }
    this.cities.set(id, newCity)
    return newCity
  }

  list() {
    return Array.from(this.cities.values())
  }

  get(id) {
    return this.cities.get(id) || null
  }

  update(id, { name, country }) {
    const existing = this.cities.get(id)
    if (!existing) return null
    const updated = { ...existing }
    if (name !== undefined) updated.name = name
    if (country !== undefined) updated.country = country
    this.cities.set(id, updated)
    return updated
  }

  delete(id) {
    return this.cities.delete(id)
  }
}

module.exports = new cityModel()
