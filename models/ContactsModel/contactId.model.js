const sequelize = require('../../config/DB/DB.config')
const {DataTypes} = require('sequelize')

const contactIdModel = sequelize.define('contact', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    contactType:{
        type: DataTypes.ENUM("Ministry","State Department","Parastatal","Private",'County','Learning Institution','Presidency','Board',"Commission"),
        allowNull: false,
    },
    activeState:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false
    }
})

contactIdModel.sync()

module.exports = contactIdModel