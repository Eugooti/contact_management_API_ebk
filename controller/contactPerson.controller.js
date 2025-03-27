const contactPersonModel = require('../models/PeopleModel/people.model')
const {CRUDContacts} = require("../handlers/contacts");

module.exports = CRUDContacts(contactPersonModel);