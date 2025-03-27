const privateModel = require("../models/private.model");
const {CRUDMethods} = require("../handlers/CRUD");

module.exports = CRUDMethods(privateModel)