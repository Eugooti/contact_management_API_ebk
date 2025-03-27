const model = require("../../models/Organizations/counties.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)