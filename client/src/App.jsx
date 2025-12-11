import React, { useState } from "react";
import AdminPanel from "./AdminPanel.jsx";

function App() 
{   
    // local
    // const API_BASE = "http://localhost:5001";

    const API_BASE = "http://3.143.143.205:5001";

    // Local component state
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");

    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [weatherCity, setWeatherCity] = useState("");
    const [weatherOutput, setWeatherOutput] = useState("");

    const [currentUser, setCurrentUser] = useState(null);

    /*
        Method: Register
        Purpose: Register a new user account.
    */
    async function Register(event) 
    {
        event.preventDefault();

        const response = await fetch(API_BASE + "/register",
        {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(
            {
                username : registerUsername,
                password : registerPassword,
                email    : registerEmail
            })
        });

        const data = await response.json();

        if (response.ok) 
        {
            alert("Registration successful!");
        }
        else 
        {
            alert(data.error);
        }
    }

    /*
        Method: Login
        Purpose: Authenticate user and store JWT locally.
    */
    async function Login(event)
    {
        event.preventDefault();

        const response = await fetch(API_BASE + "/login",
        {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(
            {
                username : loginUsername,
                password : loginPassword
            })
        });

        const data = await response.json();

        if (response.ok) 
        {
            // Save JWT
            localStorage.setItem("token", data.token);

            // Save user info in state
            setCurrentUser(
            {
                id       : data.user.id,
                username : data.user.username,
                role     : data.user.role
            });

            alert("Login successful!");
        } 
        else 
        {
            alert(data.error);
        }
    }

    /*
        Method: GetWeather
        Purpose: Get weather forecast for a city.
    */
    async function GetWeather(event)
    {
        event.preventDefault();

        const response = await fetch(API_BASE + "/weather/" + weatherCity);
        const data = await response.json();

        if (response.ok) 
        {
            setWeatherOutput(JSON.stringify(data, null, 2));
        }
        else 
        {
            alert(data.error);
        }
    }

    /*
        Method: Logout
        Purpose: Clear JWT + user state.
    */
    function Logout()
    {
        localStorage.removeItem("token");
        setCurrentUser(null);
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Weather App</h1>

            {/* Login Section */}
            <h2>Login</h2>
            <form onSubmit={Login}>
                <input type="text"
                       placeholder="Username"
                       value={loginUsername}
                       onChange={(e) => setLoginUsername(e.target.value)}
                       required />

                <input type="password"
                       placeholder="Password"
                       value={loginPassword}
                       onChange={(e) => setLoginPassword(e.target.value)}
                       required />

                <button type="submit">Login</button>
            </form>

            {/* Show logout + user info */}
            {currentUser && (
                <div>
                    <p>Logged in as: {currentUser.username} ({currentUser.role})</p>
                    <button onClick={Logout}>Logout</button>
                </div>
            )}

            <hr />

            {/* Registration Section */}
            <h2>Register</h2>
            <form onSubmit={Register}>
                <input type="text"
                       placeholder="Username"
                       value={registerUsername}
                       onChange={(e) => setRegisterUsername(e.target.value)}
                       required />

                <input type="password"
                       placeholder="Password"
                       value={registerPassword}
                       onChange={(e) => setRegisterPassword(e.target.value)}
                       required />

                <input type="email"
                       placeholder="Email"
                       value={registerEmail}
                       onChange={(e) => setRegisterEmail(e.target.value)}
                       required />

                <button type="submit">Register</button>
            </form>

            <hr />

            {/* Weather Lookup */}
            <h2>Weather Lookup</h2>
            <form onSubmit={GetWeather}>
                <input type="text"
                       placeholder="City (e.g. Seattle)"
                       value={weatherCity}
                       onChange={(e) => setWeatherCity(e.target.value)}
                       required />

                <button type="submit">Get Weather</button>
            </form>

            <pre>{weatherOutput}</pre>

            <hr />

            {/* ADMIN PANEL DISPLAY (superadmin OR admin) */}
            {currentUser && (currentUser.role === "admin" || currentUser.role === "superadmin") && (
                <div>
                    <h2>Admin Panel</h2>
                    <AdminPanel/>
                </div>
            )}
        </div>
    );
}

export default App;
