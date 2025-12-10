import { useState } from "react";

/*
    Simple Frontend UI for Testing Backend API.
    Contains:
    - Login form
    - Register form
    - Weather lookup form
*/

function App()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [registerEmail, setRegisterEmail] = useState("");
    const [weatherCity, setWeatherCity] = useState("");

    const [output, setOutput] = useState("");

    // --------------------------------------------------------
    // Helper function to call backend
    // --------------------------------------------------------

    async function apiRequest(path, method, body)
    {
        const response = await fetch(`http://localhost:3001${path}`, {method : method, headers : 
                {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(body)
            }
        );

        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
    }

    // --------------------------------------------------------
    // Event Handlers
    // --------------------------------------------------------

    async function handleLogin(e)
    {
        e.preventDefault();
        await apiRequest("/login", "POST", {username : username, password : password});
    }

    async function handleRegister(e)
    {
        e.preventDefault();
        await apiRequest("/register", "POST", { username : username, password : password, email    : registerEmail });
    }

    async function handleGetWeather(e)
    {
        e.preventDefault();

        const response = await fetch(
            `http://localhost:3001/weather/${weatherCity}`
        );

        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
    }

    // --------------------------------------------------------
    // Render UI
    // --------------------------------------------------------

    return (
        <div style={{ padding : "20px", fontFamily : "Arial" }}>
            <h1>Weather App Demo UI</h1>

            {/* Login Form */}
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <br />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <br />
                <button type="submit">Login</button>
            </form>

            <hr />

            {/* Register Form */}
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <br />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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

            {/* Weather Form */}
            <h2>Get Weather</h2>
            <form onSubmit={handleGetWeather}>
                <input 
                    type="text"
                    placeholder="City (Seattle)"
                    value={weatherCity}
                    onChange={e => setWeatherCity(e.target.value)}
                />
                <br />
                <button type="submit">Get Forecast</button>
            </form>

            <hr />

            {/* Output */}
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

