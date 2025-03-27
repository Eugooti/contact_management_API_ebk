const sequelize = require('../../config/DB/DB.config')
const {DataTypes} = require('sequelize');

const commissions = sequelize.define('commissions', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    acronym:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    mandate:{
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

commissions.sync()

module.exports = commissions;