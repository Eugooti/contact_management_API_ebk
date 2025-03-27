const parastatalModel = require("../models/stateCorporation.model");
const {CRUDMethods} = require("../handlers/CRUD");

module.exports = CRUDMethods(parastatalModel);