const model = require("../../models/Organizations/stateDepartment.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)