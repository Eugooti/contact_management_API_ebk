const jobsModel = require("../models/PeopleModel/personJobs.model");
const {CRUDMethods} = require("../handlers/CRUD");

module.exports = CRUDMethods(jobsModel);