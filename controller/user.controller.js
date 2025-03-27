const userModel = require('../models/PeopleModel/users.model')
const {UsersMethods} = require("../handlers/users");

module.exports = UsersMethods(userModel);