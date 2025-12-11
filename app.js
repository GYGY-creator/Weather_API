require('dotenv').config();
const express = require('express');
const { RequireLogin, RequireRole } = require('./middleware/auth');
const app = express();

const path = require('path');
const PORT = process.env.PORT || 5001;

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
const weatherController = require('./controllers/weatherController');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');

// router → controller mapping
app.post('/register', userController.Register);
app.post('/login', userController.Login);
app.get('/weather/:city', weatherController.GetForecast);

// admin routes
// ADMIN ROUTES (all require login + admin)
app.use("/admin", RequireLogin, RequireRole("admin"));

// list users
app.get("/admin/users", adminController.ListUsers);

// get single user
app.get("/admin/users/:id", adminController.GetUser);

// update user
app.put("/admin/users/:id", adminController.UpdateUser);

// delete user
app.delete("/admin/users/:id", adminController.DeleteUser);

// promote (superadmin only)
app.post(
    "/admin/users/:id/promote",
    RequireRole("superadmin"),
    adminController.PromoteUserToAdmin
);

// demote (superadmin only)
app.post(
    "/admin/users/:id/demote",
    RequireRole("superadmin"),
    adminController.DemoteAdminToUser
);


import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Express server running at http://localhost:${PORT}`);
    });
}