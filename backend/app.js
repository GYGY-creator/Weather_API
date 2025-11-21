const express = require('express');
const app = express();
const weatherModel = require('./models/weather')
const cityModel = require('./models/city')
const userModel = require('./models/user')
const PORT = 3001;

// Example middleware: logs request method and URL
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Lightweight CORS middleware so the React dev server (different origin) can call this API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
})

// Parse JSON bodies (for POST requests)
app.use(express.json());

// Default page
app.get('/', (req, res) => {
    res.send('Welcome to the Weather API!');
});

// Weather API
// GET /weather - list all weather entries
app.get('/weather', (req, res) => {
    res.json(weatherModel.list())
})

// GET /weather/:entryId - get single weather entry
// `req.params.entryId` contains the path parameter (e.g. for `/weather/42` it's `'42'`).
app.get('/weather/:entryId', (req, res) => {
    const entry = weatherModel.get(req.params.entryId)
    if (!entry) return res.status(404).json({ error: 'Weather entry not found' })
    res.json(entry)
})

// POST /weather - create new weather entry
app.post('/weather', (req, res) => {
    const validation = weatherModel.validate(req.body)
    if (!validation.valid) return res.status(400).json({ error: validation.error })
    const created = weatherModel.create(req.body)
    res.status(201).json(created)
})

// PUT /weather/:entryId - update existing weather entry
app.put('/weather/:entryId', (req, res) => {
    const existing = weatherModel.get(req.params.entryId)
    if (!existing) return res.status(404).json({ error: 'Weather entry not found' })
    const validation = weatherModel.validate({ name: req.body.name ?? existing.name, description: req.body.description ?? existing.description })
    if (!validation.valid) return res.status(400).json({ error: validation.error })
    const updated = weatherModel.update(req.params.entryId, req.body)
    res.json(updated)
})

// DELETE /weather/:entryId - delete weather entry
app.delete('/weather/:entryId', (req, res) => {
    const existing = weatherModel.get(req.params.entryId)
    if (!existing) return res.status(404).json({ error: 'Weather entry not found' })
    weatherModel.delete(req.params.entryId)
    res.status(204).end()
})

// Cities API
// GET /cities - list all cities
app.get('/cities', (req, res) => {
    res.json(cityModel.list())
})

// GET /cities/:cityId - get single city
// `req.params.cityId` contains the path parameter (e.g. for `/cities/<id>`).
app.get('/cities/:cityId', (req, res) => {
    const entry = cityModel.get(req.params.cityId)
    if (!entry) return res.status(404).json({ error: 'City not found' })
    res.json(entry)
})

// POST /cities - create new city
app.post('/cities', (req, res) => {
    const validation = cityModel.validate(req.body)
    if (!validation.valid) return res.status(400).json({ error: validation.error })
    const created = cityModel.create(req.body)
    res.status(201).json(created)
})

// PUT /cities/:cityId - update existing city
app.put('/cities/:cityId', (req, res) => {
    const existing = cityModel.get(req.params.cityId)
    if (!existing) return res.status(404).json({ error: 'City not found' })
    const validation = cityModel.validate({ name: req.body.name ?? existing.name, country: req.body.country ?? existing.country })
    if (!validation.valid) return res.status(400).json({ error: validation.error })
    const updated = cityModel.update(req.params.cityId, req.body)
    res.json(updated)
})

// DELETE /cities/:cityId - delete city
app.delete('/cities/:cityId', (req, res) => {
    const existing = cityModel.get(req.params.cityId)
    if (!existing) return res.status(404).json({ error: 'City not found' })
    cityModel.delete(req.params.cityId)
    res.status(204).end()
})

// Users API
// GET /users - list all users
app.get('/users', (req, res) => {
    res.json(userModel.list())
})

// GET /users/:userId - get single user
// `req.params.userId` contains the path parameter (e.g. for `/users/<id>`).
app.get('/users/:userId', (req, res) => {
    const entry = userModel.get(req.params.userId)
    if (!entry) return res.status(404).json({ error: 'User not found' })
    res.json(entry)
})

// POST /users - create new user
app.post('/users', (req, res) => {
    const validation = userModel.validate(req.body)
    if (!validation.valid) return res.status(400).json({ error: validation.error })
    const created = userModel.create(req.body)
    res.status(201).json(created)
})

// PUT /users/:userId - update existing user
app.put('/users/:userId', (req, res) => {
    const existing = userModel.get(req.params.userId)
    if (!existing) return res.status(404).json({ error: 'User not found' })
    const validation = userModel.validate({ name: req.body.name ?? existing.name, description: req.body.description ?? existing.description })
    if (!validation.valid) return res.status(400).json({ error: validation.error })
    const updated = userModel.update(req.params.userId, req.body)
    res.json(updated)
})

// DELETE /users/:userId - delete user
app.delete('/users/:userId', (req, res) => {
    const existing = userModel.get(req.params.userId)
    if (!existing) return res.status(404).json({ error: 'User not found' })
    userModel.delete(req.params.userId)
    res.status(204).end()
})

module.exports = app

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Express server running at http://localhost:${PORT}`);
	});
}