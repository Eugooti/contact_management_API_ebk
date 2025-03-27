const userModel = require('../models/PeopleModel/users.model')
const {AuthHandler} = require("../handlers/auth");

module.exports = AuthHandler(userModel)