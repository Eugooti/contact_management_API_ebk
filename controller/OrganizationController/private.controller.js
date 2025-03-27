const model = require("../../models/Organizations/private.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)