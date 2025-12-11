import { useState } from "react";
import AdminPanel from "./AdminPanel.jsx";

function App()
{
    // REGISTER fields
    const [usernameRegister, setUsernameRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");

    // LOGIN fields
    const [usernameLogin, setUsernameLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");

    // WEATHER
    const [weatherCity, setWeatherCity] = useState("");

    // OUTPUT
    const [output, setOutput] = useState("");

    // BACKEND URL
    const backendURL = `http://localhost:5001`;

    // PAGE VIEW (home or admin)
    const [view, setView] = useState("home");

    // Helper for backend requests
    async function apiRequest(path, method, body)
    {
        const response = await fetch(`${backendURL}${path}`,
        {
            method : method,
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(body)
        });

        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
    }

    // Event Handlers

    async function handleLogin(e)
    {
        e.preventDefault();
        await apiRequest("/login", "POST", 
        {
            username : usernameLogin,
            password : passwordLogin
        });
    }

    async function handleRegister(e)
    {
        e.preventDefault();
        await apiRequest("/register", "POST", 
        {
            username : usernameRegister,
            password : passwordRegister,
            email    : registerEmail
        });
    }

    async function handleGetWeather(e)
    {
        e.preventDefault();

        const response = await fetch(`${backendURL}/weather/${weatherCity}`);
        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
    }

    // If Admin view → show AdminPanel only
    if (view === "admin")
    {
        return (
            <div style={{ padding: "20px" }}>
                <button onClick={() => setView("home")}>← Back to Home</button>
                <AdminPanel />
            </div>
        );
    }

    // Otherwise show HOME view
    return (
        <div style={{ padding : "20px", fontFamily : "Arial" }}>
            <h1>Weather App Demo UI</h1>

            {/* NAVIGATION */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setView("admin")}>Go to Admin Panel</button>
            </div>

            {/* LOGIN */}
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={usernameLogin}
                    onChange={e => setUsernameLogin(e.target.value)}
                />
                <br />
                <input 
                    type="password"
                    placeholder="Password"
                    value={passwordLogin}
                    onChange={e => setPasswordLogin(e.target.value)}
                />
                <br />
                <button type="submit">Login</button>
            </form>

            <hr />

            {/* REGISTER */}
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={usernameRegister}
                    onChange={e => setUsernameRegister(e.target.value)}
                />
                <br />
                <input 
                    type="password"
                    placeholder="Password"
                    value={passwordRegister}
                    onChange={e => setPasswordRegister(e.target.value)}
                />
                <br />
                <input 
                    type="email"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={e => setRegisterEmail(e.target.value)}
                />
                <br />
                <button type="submit">Register</button>
            </form>

            <hr />

            {/* WEATHER */}
            <h2>Get Weather</h2>
            <form onSubmit={handleGetWeather}>
                <input 
                    type="text"
                    placeholder="City"
                    value={weatherCity}
                    onChange={e => setWeatherCity(e.target.value)}
                />
                <br />
                <button type="submit">Get Forecast</button>
            </form>

            <hr />

            {/* OUTPUT */}
            <h2>Response Output</h2>
            <pre style={{
                background : "#eee",
                padding : "10px",
                borderRadius : "5px",
                minHeight : "150px"
            }}>
                {output}
            </pre>
        </div>
    );
}

export default App;


