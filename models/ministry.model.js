const sequelize = require('../config/DB/DB.config')
const {DataTypes} = require('sequelize')

const ministryModel = sequelize.define('ministry', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    contact_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'contacts',
            key: 'id',
        },
        onDelete: 'CASCADE',

    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    sector:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    mandate:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    street:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    city:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    country:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    building:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalCode:{
        type: DataTypes.STRING,
        allowNull: false,
    }

})

ministryModel.sync()

module.exports = ministryModel;
