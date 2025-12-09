// controllers/alertController.js

// Import required modules
const axios = require('axios');
const UserModel = require('../models/user');
const cityCoordinates = require('../models/city_coords');

/*
    Method: SendAlerts
    Purpose: Simulate sending weather alerts to all users.
    Notes:
    - Useful for demonstration purposes.
    - Prints notifications to server console.
*/
async function SendAlerts(req, res) 
{
    try 
    {
        const userList = await UserModel.GetAll();
        const alertResults = [];

        for (let i = 0; i < userList.length; i++) 
        {
            const currentUser = userList[i];
            const cityName = currentUser.address;

            // Skip if city is missing or unsupported
            if (!cityName || !cityCoordinates[cityName]) 
            {
                continue;
            }

            const office = cityCoordinates[cityName].office;
            const gridX = cityCoordinates[cityName].gridX;
            const gridY = cityCoordinates[cityName].gridY;

            const requestUrl = 
                `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`;

            const response = await axios.get(requestUrl);

            const todayForecast = response.data?.properties?.periods?.[0];

            console.log(
                'Sending alert to:', 
                currentUser.email, 
                ' Forecast:', 
                todayForecast.shortForecast
            );

            alertResults.push(
            { 
                user : currentUser.email, 
                city : cityName, 
                forecast : todayForecast.shortForecast 
            });
        }

        return res.json(
        { 
            message : 'Simulated alerts sent successfully.', 
            alerts : alertResults 
        });
    } 
    catch (error) 
    {
        console.error('Error in SendAlerts:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = 
{
    SendAlerts
};
