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

        // Lookup city from DB
        const city = await cityModel.Model.findOne({ where: { name: cityName } });
        if (!city) {
            return res.status(400).json({ error: 'City not found in database.' });
        }

        const office = city.office;
        const gridX  = city.gridX;
        const gridY  = city.gridY;

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

