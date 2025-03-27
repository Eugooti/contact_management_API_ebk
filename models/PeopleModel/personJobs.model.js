const sequelize = require('../../config/DB/DB.config')
const {DataTypes} = require('sequelize')

const jobs = sequelize.define('jobs', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    personId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'people',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    job:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    workPlace:{
        type: DataTypes.STRING,
        allowNull: false,
    }
})

jobs.sync()

module.exports = jobs