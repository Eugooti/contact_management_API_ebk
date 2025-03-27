const addressModel = require("../models/AddressModels/address.model");
const {CRUDMethods} = require("../handlers/CRUD");

module.exports = CRUDMethods(addressModel);