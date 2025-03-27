const model = require("../../models/Organizations/boards.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)