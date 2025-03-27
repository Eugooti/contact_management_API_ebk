const model = require("../../models/Organizations/presidency.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)