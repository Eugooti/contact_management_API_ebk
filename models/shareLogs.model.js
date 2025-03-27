const sequelize = require('../config/DB/DB.config')
const {DataTypes} = require('sequelize');

const shareLogs = sequelize.define('shareLogs',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    contactId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'contacts',
            key: 'id',
        }
    }
})

shareLogs.sync()

module.exports = shareLogs;