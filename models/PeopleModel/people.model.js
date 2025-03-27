const sequelize = require('../../config/DB/DB.config')
const {DataTypes} = require('sequelize')

const person = sequelize.define('people', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

person.sync()

module.exports = person