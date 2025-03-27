const sequelize = require('../../config/DB/DB.config')
const {DataTypes} = require('sequelize');

const presidency = sequelize.define('presidency', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        type: DataTypes.ENUM("Office of The President","Office of The Deputy President"),
        allowNull: false,
        unique: true,
    },
    sector:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Executive",
    },
    mandate:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "National Governance",
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

presidency.sync()

module.exports = presidency