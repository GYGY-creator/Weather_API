// controllers/weatherController.js

// Import required modules
const cityCoordinates = require('../models/city_coords');

/*
    Method: GetForecast
    Purpose: Retrieve weather forecast for a given city using native fetch().
*/
async function GetForecast(req, res) 
{
    try 
    {
        const cityName = req.params.city;

        // Validate city
        if (!cityName || !cityCoordinates[cityName]) 
        {
            return res.status(400).json(
            {
                error : 'Unsupported or missing city name.'
            });
        }

        const office = cityCoordinates[cityName].office;
        const gridX  = cityCoordinates[cityName].gridX;
        const gridY  = cityCoordinates[cityName].gridY;

        const requestUrl = 
            `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`;

        // Fetch forecast data using native Node.js fetch
        const response = await fetch(requestUrl);

        if (!response.ok)
        {
            return res.status(500).json(
            {
                error : 'Weather API did not respond properly.'
            });
        }

        const data = await response.json();

        const todayForecast = data
            ?.properties
            ?.periods
            ?.[0];

        return res.status(200).json(
        { 
            city     : cityName, 
            forecast : todayForecast 
        });
    } 
    catch (error) 
    {
        console.error('Error in GetForecast:', error);

        return res.status(500).json(
        {
            error : 'Failed to fetch weather data.'
        });
    }
}

module.exports = 
{
    GetForecast
};

