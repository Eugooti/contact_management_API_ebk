const {CRUDMethods} = require("../CRUD");
const {ReadContacts} = require("./ReadContatcs");
const {deleteContact} = require("./deleteContact");
const {deleteContactPerson} = require("./deleteContactPerson");
const {SendContact} = require("../Mail/sendContact");
const {createContactPerson} = require("./createContactPerson");
const {CreateContact} = require("./CreateContact");
const {ReadOrganizationStaff} = require("./readOrganizationStaff");
const CRUDContacts = (model) => {
  const methods = CRUDMethods(model)


    methods.shareContact = async (req,res)=>{
      await SendContact(req,res)
    }


    methods.createContactPerson = async (req,res)=>{
      await createContactPerson(req,res)
    }

    methods.readContacts = async (req,res)=>{
      await ReadContacts(req,res)
    }

    methods.deleteContact = async (req,res)=>{
      await deleteContact(req,res)
    }

    methods.deleteContactPerson = async (req,res)=>{
      await deleteContactPerson(req,res)
    }

    methods.createContact= async (req,res)=>{
      await CreateContact(req,res)
    }

    methods.readStaff = async (req,res)=>{
    await ReadOrganizationStaff(req,res)
    }

    return methods
}

module.exports = {CRUDContacts}