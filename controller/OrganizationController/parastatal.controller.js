const model = require("../../models/Organizations/parastatal.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)