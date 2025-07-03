const sequelize = require("../../config/DB/DB.config");
const {DataTypes} = require('sequelize')

const users = sequelize.define("users", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role:{
        type: DataTypes.ENUM('ADMIN',"USER"),
        allowNull: false
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

users.sync()

module.exports = users;