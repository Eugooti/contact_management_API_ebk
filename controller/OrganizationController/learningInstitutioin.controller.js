const model = require("../../models/Organizations/learningInstitution.model");
const {CRUDMethods} = require("../../handlers/CRUD");

module.exports = CRUDMethods(model)