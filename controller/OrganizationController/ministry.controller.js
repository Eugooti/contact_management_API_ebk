const model = require("../../models/Organizations/ministry.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)