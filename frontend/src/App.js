import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Weather state
  const [weatherData, setWeatherData] = useState([]);
  const [weatherFormData, setWeatherFormData] = useState({ name: '', description: '' });
  
  // Cities state
  const [cityData, setCityData] = useState([]);
  const [cityFormData, setCityFormData] = useState({ name: '', country: '' });
  
  // Users state
  const [userData, setUserData] = useState([]);
  const [userFormData, setUserFormData] = useState({ name: '', description: '' });
  
  // Global message
  const [message, setMessage] = useState('');

  // Fetch weather data
  const fetchWeather = () => {
    fetch('/weather')
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
        updateMessage(`Weather: ${data.length} entries`);
      })
      .catch(error => {
        setMessage('Failed to fetch weather data');
      });
  };

  // Fetch cities data
  const fetchCities = () => {
    fetch('/cities')
      .then(res => res.json())
      .then(data => {
        setCityData(data);
        updateMessage(`Cities: ${data.length} entries`);
      })
      .catch(error => {
        setMessage('Failed to fetch cities data');
      });
  };

  // Fetch users data
  const fetchUsers = () => {
    fetch('/users')
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        updateMessage(`Users: ${data.length} entries`);
      })
      .catch(error => {
        setMessage('Failed to fetch users data');
      });
  };

  // Load all data on component mount
  useEffect(() => {
    fetchWeather();
    fetchCities();
    fetchUsers();
  }, []);

  const updateMessage = (msg) => {
    setMessage(` ${msg}`);
  };

  // Handle weather form submission
  const handleWeatherSubmit = (e) => {
    e.preventDefault();
    
    fetch('/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weatherFormData)
    })
    .then(res => res.json())
    .then(newWeather => {
      setMessage(`Created weather entry: ${newWeather.name}`);
      setWeatherFormData({ name: '', description: '' });
      fetchWeather();
    })
    .catch(error => {
      setMessage('Failed to create weather entry');
    });
  };

  // Handle city form submission
  const handleCitySubmit = (e) => {
    e.preventDefault();
    
    fetch('/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cityFormData)
    })
    .then(res => res.json())
    .then(newCity => {
      setMessage(`Created city entry: ${newCity.name}`);
      setCityFormData({ name: '', country: '' });
      fetchCities();
    })
    .catch(error => {
      setMessage('Failed to create city entry');
    });
  };

  // Handle user form submission
  const handleUserSubmit = (e) => {
    e.preventDefault();
    
    fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userFormData)
    })
    .then(res => res.json())
    .then(newUser => {
      setMessage(`Created user entry: ${newUser.name}`);
      setUserFormData({ name: '', description: '' });
      fetchUsers();
    })
    .catch(error => {
      setMessage('Failed to create user entry');
    });
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Weather API Dashboard</h1>
      <p style={{ fontSize: '18px', margin: '20px 0' }}>{message}</p>

      {/* Weather Section */}
      <div style={{ marginBottom: '40px', border: '2px solid #blue', padding: '20px', borderRadius: '8px' }}>
        <h2>Weather Management</h2>
        
        {/* Weather Form */}
        <div style={{ marginBottom: '20px', backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '5px' }}>
          <h3>Add New Weather Entry</h3>
          <form onSubmit={handleWeatherSubmit}>
            <div style={{ margin: '10px 0' }}>
              <label>Name (Location): </label>
              <input
                type="text"
                value={weatherFormData.name}
                onChange={(e) => setWeatherFormData({...weatherFormData, name: e.target.value})}
                placeholder="e.g., Seattle Weather"
                required
                style={{ margin: '0 10px', padding: '8px', width: '200px' }}
              />
            </div>
            <div style={{ margin: '10px 0' }}>
              <label>Description: </label>
              <input
                type="text"
                value={weatherFormData.description}
                onChange={(e) => setWeatherFormData({...weatherFormData, description: e.target.value})}
                placeholder="e.g., Sunny, 72°F"
                required
                style={{ margin: '0 10px', padding: '8px', width: '300px' }}
              />
            </div>
            <button type="submit" style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              Add Weather Entry
            </button>
          </form>
        </div>

        {/* Weather Table */}
        <div>
          <h3>Weather Entries ({weatherData.length})</h3>
          {weatherData.length === 0 ? (
            <p>No weather entries yet.</p>
          ) : (
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#e7f3ff' }}>
                <tr>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.map(weather => (
                  <tr key={weather.id}>
                    <td style={{ padding: '10px' }}>{weather.id.slice(0, 8)}...</td>
                    <td style={{ padding: '10px' }}>{weather.name}</td>
                    <td style={{ padding: '10px' }}>{weather.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Cities Section */}
      <div style={{ marginBottom: '40px', border: '2px solid green', padding: '20px', borderRadius: '8px' }}>
        <h2>Cities Management</h2>
        
        {/* Cities Form */}
        <div style={{ marginBottom: '20px', backgroundColor: '#f0fff0', padding: '15px', borderRadius: '5px' }}>
          <h3>Add New City</h3>
          <form onSubmit={handleCitySubmit}>
            <div style={{ margin: '10px 0' }}>
              <label>City Name: </label>
              <input
                type="text"
                value={cityFormData.name}
                onChange={(e) => setCityFormData({...cityFormData, name: e.target.value})}
                placeholder="e.g., Seattle"
                required
                style={{ margin: '0 10px', padding: '8px', width: '200px' }}
              />
            </div>
            <div style={{ margin: '10px 0' }}>
              <label>Country: </label>
              <input
                type="text"
                value={cityFormData.country}
                onChange={(e) => setCityFormData({...cityFormData, country: e.target.value})}
                placeholder="e.g., USA"
                required
                style={{ margin: '0 10px', padding: '8px', width: '200px' }}
              />
            </div>
            <button type="submit" style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
              Add City
            </button>
          </form>
        </div>

        {/* Cities Table */}
        <div>
          <h3>Cities ({cityData.length})</h3>
          {cityData.length === 0 ? (
            <p>No cities yet.</p>
          ) : (
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#e7f5e7' }}>
                <tr>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Country</th>
                </tr>
              </thead>
              <tbody>
                {cityData.map(city => (
                  <tr key={city.id}>
                    <td style={{ padding: '10px' }}>{city.id.slice(0, 8)}...</td>
                    <td style={{ padding: '10px' }}>{city.name}</td>
                    <td style={{ padding: '10px' }}>{city.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Users Section */}
      <div style={{ marginBottom: '40px', border: '2px solid purple', padding: '20px', borderRadius: '8px' }}>
        <h2>👥 Users Management</h2>
        
        {/* Users Form */}
        <div style={{ marginBottom: '20px', backgroundColor: '#faf0ff', padding: '15px', borderRadius: '5px' }}>
          <h3>Add New User</h3>
          <form onSubmit={handleUserSubmit}>
            <div style={{ margin: '10px 0' }}>
              <label>User Name: </label>
              <input
                type="text"
                value={userFormData.name}
                onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                placeholder="e.g., John Doe"
                required
                style={{ margin: '0 10px', padding: '8px', width: '200px' }}
              />
            </div>
            <div style={{ margin: '10px 0' }}>
              <label>Description: </label>
              <input
                type="text"
                value={userFormData.description}
                onChange={(e) => setUserFormData({...userFormData, description: e.target.value})}
                placeholder="e.g., Weather enthusiast"
                required
                style={{ margin: '0 10px', padding: '8px', width: '300px' }}
              />
            </div>
            <button type="submit" style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}>
              Add User
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div>
          <h3>Users ({userData.length})</h3>
          {userData.length === 0 ? (
            <p>No users yet.</p>
          ) : (
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f0e7f5' }}>
                <tr>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {userData.map(user => (
                  <tr key={user.id}>
                    <td style={{ padding: '10px' }}>{user.id.slice(0, 8)}...</td>
                    <td style={{ padding: '10px' }}>{user.name}</td>
                    <td style={{ padding: '10px' }}>{user.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
