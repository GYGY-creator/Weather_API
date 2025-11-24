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
// POST /weather - create new weather entry
app.post('/weather', async (req, res) => {
    try {
    const validation = weatherModel.Validate(req.body)
    if (!validation.valid) return res.status(400).json({ error: validation.error })
    const created = await weatherModel.Create(req.body)
    res.status(201).json(created)
    } catch (error) {
        console.error('POST /weather error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// GET /weather - list all weather entries
app.get('/weather', async (req, res) => {
    try {
    const rows = await weatherModel.GetAll()
    res.json(rows)
    } catch (error) {
        console.error('GET /weather error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// GET /weather/:entryId - get single weather entry
app.get('/weather/:entryId', async (req, res) => {
    try {
    const existing = await weatherModel.Get(req.params.entryId)
    if (!existing) return res.status(404).json({ error: 'Weather not found' })
    res.json(existing)
    } catch (error) {
        console.error('GET /weather error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// PUT /weather/:entryId - update existing weather entry
app.put('/weather/:entryId', async (req, res) => {
   try {
    const existing = await weatherModel.Get(req.params.entryId)
    if (!existing) return res.status(404).json({ error: 'Weather entry not found' })
    const validation = weatherModel.Validate({ name: req.body.name ?? existing.name, description: req.body.description ?? existing.description })
    if (!validation.valid) return res.status(400).json({ error: validation.error })
    const updated = await weatherModel.Update(req.params.entryId, req.body)
    res.json(updated)
   } catch (error) {
        console.error('PUT /weather error', error);
        res.status(500).json({ error: 'Internal Server Error' });
   }
})

// DELETE /weather/:entryId - delete weather entry
app.delete('/weather/:entryId', async (req, res) => {
    try {
    const existing = await weatherModel.Get(req.params.entryId)
    if (!existing) return res.status(404).json({ error: 'Weather entry not found' })
    await weatherModel.Delete(req.params.entryId)
    res.status(204).end()
    } catch (error) {
        console.error('DELETE /weather error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Cities API
// POST /cities - create new city
app.post('/cities', async (req, res) => {

    try {
        const validation = await cityModel.Validate(req.body)
        if (!validation.valid) return res.status(400).json({ error: validation.error })
        const created = await cityModel.Create(req.body)
        res.status(201).json(created)
    } catch (error) {
        console.error('POST /cities error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// GET /cities - list all cities
app.get('/cities', async (req, res) => {

    try {
        const rows = await cityModel.GetAll()
        res.json(rows)
    } catch (error) {
        console.error('GET /cities error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// GET /cities/:cityId - get single city
app.get('/cities/:cityId', async (req, res) => {
    try {
        const existing = await cityModel.Get(req.params.cityId)
        if (!existing) return res.status(404).json({ error: 'City not found' })
        res.json(existing)
    } catch (error) {
        console.error('GET /cities error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// PUT /cities/:cityId - update existing city
app.put('/cities/:cityId', async (req, res) => {
    try {
        const existing = await cityModel.Get(req.params.cityId)
        if (!existing) return res.status(404).json({ error: 'City not found' })
        const validation = cityModel.Validate({ name: req.body.name ?? existing.name, country: req.body.country ?? existing.country })
        if (!validation.valid) return res.status(400).json({ error: validation.error })
        const updated = await cityModel.Update(req.params.cityId, req.body)
        res.json(updated)
    } catch (error) {
        console.error('PUT /cities error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// DELETE /cities/:cityId - delete city
app.delete('/cities/:cityId', async (req, res) => {
    try {
    const existing = await cityModel.Get(req.params.cityId)
    if (!existing) return res.status(404).json({ error: 'City not found' })
    await cityModel.Delete(req.params.cityId)
    res.status(204).end()
    } catch (error) {
        console.error('DELETE /cities error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Users API (database-backed)
// GET /users - list all users
app.get('/users', async (req, res) => {
    try {
        const rows = await userModel.GetAll()
        res.json(rows)
    } catch (error) {
        console.error('GET /users error', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// GET /users/:userId - get single user
app.get('/users/:userId', async (req, res) => {
    try {
        const entry = await userModel.Get(req.params.userId)
        if (!entry) return res.status(404).json({ error: 'User not found' })
        res.json(entry)
    } catch (error) {
        console.error('GET /users/:userId error', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// POST /users - create new user
app.post('/users', async (req, res) => {
    try {
        const validation = userModel.Validate(req.body)
        if (!validation.valid) return res.status(400).json({ error: validation.error })
        const created = await userModel.Create(req.body)
        res.status(201).json(created)
    } catch (error) {
        console.error('POST /users error', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// PUT /users/:userId - update existing user
app.put('/users/:userId', async (req, res) => {
    try {
        const existing = await userModel.Get(req.params.userId)
        if (!existing) return res.status(404).json({ error: 'User not found' })
        const validation = userModel.Validate({ name: req.body.name ?? existing.name, description: req.body.description ?? existing.description })
        if (!validation.valid) return res.status(400).json({ error: validation.error })
        const updated = await userModel.Update(req.params.userId, req.body)
        res.json(updated)
    } catch (error) {
        console.error('PUT /users/:userId error', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// DELETE /users/:userId - delete user
app.delete('/users/:userId', async (req, res) => {
    try {
        const existing = await userModel.Get(req.params.userId)
        if (!existing) return res.status(404).json({ error: 'User not found' })
        await userModel.Delete(req.params.userId)
        res.status(204).end()
    } catch (error) {
        console.error('DELETE /users/:userId error', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = app

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Express server running at http://localhost:${PORT}`);
	});
}