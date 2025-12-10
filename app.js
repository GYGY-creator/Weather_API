const express = require('express');
const app = express();

const path = require('path');
const PORT = 3001;

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// JSON parser
app.use(express.json());

// Controllers
const userController = require('./controllers/userController');
const weatherController = require('./controllers/weatherController');
//const alertController = require('./controllers/alertController');

// router → controller mapping
app.post('/register', userController.Register);
app.post('/login', userController.Login);
app.get('/weather/:city', weatherController.GetForecast);
//app.post('/send-alerts', alertController.SendAlerts);

// Serve frontend
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Express server running at http://localhost:${PORT}`);
    });
}