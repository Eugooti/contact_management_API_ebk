const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DBNAME,process.env.DBUSER,process.env.DBPASSWORD ,{
    host: process.env.DBHOST,
    dialect: 'mysql',
    port: process.env.DBPORT,
    logging: false,
    timezone: '+03:00',
})

module.exports = sequelize