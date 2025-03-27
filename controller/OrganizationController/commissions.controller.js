const model = require("../../models/Organizations/commissions.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)