import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');

  // Fetch weather data
  const fetchWeather = () => {
    fetch('/weather')
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
        setMessage(`Found ${data.length} weather entries`);
      })
      .catch(error => {
        setMessage('Failed to fetch weather data');
      });
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(newWeather => {
      setMessage(`Created weather entry: ${newWeather.name}`);
      setFormData({ name: '', description: '' }); // Clear form
      fetchWeather(); // Refresh the list
    })
    .catch(error => {
      setMessage('Failed to create weather entry');
    });
  };

  // css
  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Weather API Dashboard</h1>
      <p>{message}</p>

      {/* Add Weather Form */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px' }}>
        <h2>Add New Weather Entry</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name (Location/Title): </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Seattle Weather"
              required
              style={{ margin: '10px', padding: '5px', width: '200px' }}
            />
          </div>
          <div>
            <label>Description: </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="e.g., Sunny, 72°F, light breeze"
              required
              style={{ margin: '10px', padding: '5px', width: '300px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', margin: '10px' }}>
            Add Weather Entry
          </button>
        </form>
      </div>

      {/* Weather List */}
      <div>
        <h2>Weather Entries ({weatherData.length})</h2>
        {weatherData.length === 0 ? (
          <p>No weather entries yet. Add one above!</p>
        ) : (
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map(weather => (
                <tr key={weather.id}>
                  <td style={{ padding: '10px' }}>{weather.id}</td>
                  <td style={{ padding: '10px' }}>{weather.name}</td>
                  <td style={{ padding: '10px' }}>{weather.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
