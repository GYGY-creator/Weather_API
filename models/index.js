const { Sequelize } = require('sequelize');
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const DB_URL = process.env.DATABASE_URL

let sequelize;

if (DB_URL) 
{
    sequelize = new Sequelize(
        DB_URL,
        { 
            dialect : 'postgres',
            logging : false
        }
    );
}
else 
{
    const db   = process.env.DB_NAME || 'postgres';
    const user = process.env.DB_USER || 'postgres';
    const pass = process.env.DB_PASS || '';
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 5432;

    const isProduction = process.env.NODE_ENV === 'production';

    sequelize = new Sequelize(
        db,
        user,
        pass,
        {
            host     : host,
            port     : port,
            dialect  : 'postgres',
            logging  : false,

            dialectOptions : isProduction
                ? {
                      ssl : 
                      {
                          require            : true,
                          rejectUnauthorized : false
                      }
                  }
                : {}
        }
    );
}


const models = {}

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
