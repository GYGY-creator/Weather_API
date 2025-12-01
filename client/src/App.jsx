import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [userData, setUserData] = useState([])
  const [cityData, setCityData] = useState([])

  function FetchWeathers() {
    
    fetch('http://localhost:3001/weathers')
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        setWeatherData(data)
      })
      .catch(function(error) {
        console.error('Error fetching weather:', error)
      })
  }

  function FetchUsers() {
    
    fetch('http://localhost:3001/users')
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        setUserData(data)
      })
      .catch(function(error) {
        console.error('Error fetching user:', error)
      })
  }

  function FetchCities() {
  fetch('http://localhost:3001/cities')
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        setCityData(data)
      })
      .catch(function(error) {
        console.error('Error fetching city:', error)
      })
  }

  // Run when component loads
  useEffect(function() {
    FetchWeathers()
  }, [])

    useEffect(function() {
    FetchUsers()
  }, [])

    useEffect(function() {
    FetchCities()
  }, [])

  // Click handler
  function RefreshWeather() {
    FetchWeathers()
  }

   function RefreshUsers() {
    FetchUsers()
  }

   function RefreshCities() {
    FetchCities()
  }

  return (
    <div>
      <h1>Weather App</h1>
      
      <ul>
          {weatherData.map(function(weather) {
            return <li key={weather.id}>{weather.name}: {weather.description}</li>
          })}
        </ul>

      <ul>
          {userData.map(function(user) {
            return <li key={user.id}>{user.name}: {user.email}</li>
          })}
        </ul>

      <ul>
          {cityData.map(function(city) {
            return <li key={city.id}>{city.name}: {city.description}</li>
          })}
        </ul>
      
      <button onClick={RefreshWeather}>Refresh Weather</button>
      <button onClick={RefreshUsers}>Refresh Users</button>
      <button onClick={RefreshCities}>Refresh Cities</button>
    </div>
  )
}

export default App
