const sequelize = require('../config/DB/DB.config')
const {DataTypes} = require('sequelize')

const stateCorporationModel = sequelize.define('stateCorporation', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
    ministry:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    mandate:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    capital:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    region:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    countyCode:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    uniType:{
        type: DataTypes.STRING,
        allowNull: true,
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

stateCorporationModel.sync()

module.exports = stateCorporationModel