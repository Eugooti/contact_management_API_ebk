const ministryModel = require("../models/ministry.model");
const {CRUDMethods} = require("../handlers/CRUD");

module.exports = CRUDMethods(ministryModel);