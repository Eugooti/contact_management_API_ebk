const sequelize = require('../../config/DB/DB.config')
const {DataTypes} = require('sequelize')

const salutations = sequelize.define('salutations', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    person_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'people',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false
    },
    salutation: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

salutations.sync()

module.exports = salutations