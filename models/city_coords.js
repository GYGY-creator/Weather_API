// models/city_coords.js

/*  
    Purpose:
    Provide static coordinate mappings required for the 
    National Weather Service (NWS) Gridpoint API.

    Notes:
    • This file is NOT a Sequelize model.
    • It is a simple lookup table used by the weather controller.
    • Only a few cities are included for MVP demonstration.
    • A dynamic grid-mapping service will be implemented later.
*/

const CityCoordinates = 
{
    Seattle : 
    { 
        office : 'SEW', 
        gridX : 130, 
        gridY : 70 
    },

    SanFrancisco : 
    { 
        office : 'MTR', 
        gridX : 88, 
        gridY : 123 
    },

    NewYork : 
    { 
        office : 'OKX', 
        gridX : 33, 
        gridY : 37 
    },

    Miami : 
    { 
        office : 'MFL', 
        gridX : 50, 
        gridY : 52 
    },

    Chicago : 
    { 
        office : 'LOT', 
        gridX : 74, 
        gridY : 73 
    }
};

module.exports = CityCoordinates;
