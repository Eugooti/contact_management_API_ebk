const sequelize = require("../../config/DB/DB.config");
const {DataTypes} = require("sequelize");

const boards = sequelize.define("boards", {
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
    mandate:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    stateDepartment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stateDepartments',
            key: 'id',
        },
        onDelete: 'CASCADE',
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

boards.sync()

module.exports = boards;