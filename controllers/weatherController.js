// controllers/weatherController.js

// Import required modules
const cityModel = require('../models/city');

/*
    Method: GetForecast
    Purpose: Retrieve weather forecast for a given city using native fetch().
*/
async function GetForecast(req, res)
{
    try 
    {
        const cityName = req.params.city;

        if (!cityName)
        {
            return res.status(400).json({ error: 'City name is required.' });
        }

        // Lookup city from DB
        const city = await cityModel.Model.findOne({ where: { name: cityName } });
        if (!city) {
            return res.status(400).json({ error: 'City not found in database.' });
        }

        const lat = city.latitude;
        const lon = city.longitude;
        const pointURL = `https://api.weather.gov/points/${lat},${lon}`;

        // Fetch forecast data using native Node.js fetch
        const pointResponse = await fetch(pointURL);

        if (!pointResponse.ok)
        {
            return res.status(500).json(
            {
                error : 'Weather API did not respond properly.'
            });
        }

        const pointData = await pointResponse.json();
        
        // Extract grid info
        const office = pointData.properties.gridId;
        const gridX = pointData.properties.gridX;
        const gridY = pointData.properties.gridY;

        // Fetch the forecast
        const forecastUrl = pointData.properties.forecast;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Extract the first day's forecast
        const today = forecastData.properties.periods[0];

        return res.status(200).json(
        {
            city      : cityName,
            latitude  : lat,
            longitude : lon,
            office    : office,
            gridX     : gridX,
            gridY     : gridY,
            forecast  : today
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

