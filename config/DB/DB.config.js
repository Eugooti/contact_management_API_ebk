const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE,process.env.DATABASE_USER,process.env.DATABASE_PASSWORD ,{
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    port: process.env.DATABASE_PORT,
    logging: false,
    timezone: '+03:00',
})

module.exports = sequelize