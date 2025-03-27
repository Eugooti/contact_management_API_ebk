const contact = require('../models/ContactsModel/contacts.model')
const {CRUDContacts} = require("../handlers/contacts");

module.exports = CRUDContacts(contact);