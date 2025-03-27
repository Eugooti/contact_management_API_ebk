const sequelize = require('../../config/DB/DB.config')
const {DataTypes} = require('sequelize')

const contacts = sequelize.define('contact_details', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    contact_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'contacts',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    person_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'people',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    office:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    type:{
        type: DataTypes.ENUM("Home","Work"),
        allowNull: false,
    }
})

contacts.sync()

module.exports = contacts