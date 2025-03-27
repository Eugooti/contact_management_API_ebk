const sequelize = require('../../config/DB/DB.config')
const {DataTypes} = require('sequelize');

const counties = sequelize.define('Counties', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    county:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    countyCode:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    capital: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    region:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    headPersonId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'people',
            key: 'id',
        }
    },
    head_position:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Governor",
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

counties.sync()

module.exports = counties