const {handleErrors, successTransaction} = require("../../utils/errorHandlers");
const contactId = require('../../models/ContactsModel/contactId.model')
const contacts = require('../../models/ContactsModel/contacts.model')
const people = require('../../models/PeopleModel/people.model')
const jobs = require('../../models/PeopleModel/personJobs.model')
const salutations = require('../../models/PeopleModel/Salutations.model')
const address = require('../../models/AddressModels/address.model')
const presidency = require('../../models/Organizations/presidency.model')
const counties = require('../../models/Organizations/counties.model')
const ministry = require('../../models/Organizations/ministry.model')
const stateDepartment = require('../../models/Organizations/stateDepartment.model')
const parastatal = require('../../models/Organizations/parastatal.model')
const commissions = require('../../models/Organizations/commissions.model')
const boards = require('../../models/Organizations/boards.model')
const privateInstitutions = require('../../models/Organizations/private.model')
const learningInstitutions = require('../../models/Organizations/learningInstitution.model')

const ReadContacts =async (req, res) => {
  try {
      // Fetch all data concurrently
      const [
          ContactIds,
          contactList,
          People,
          Jobs,
          Salutations,
          Addresses,
          Presidency,
          Counties,
          Ministry,
          StateDepartment,
          Parastatal,
          Commissions,
          Boards,
          PrivateInstitutions,
          LearningInstitutions,
      ] = await Promise.all([
          contactId.findAll({raw: true}),
          contacts.findAll({raw: true}),
          people.findAll({raw: true}),
          jobs.findAll({raw: true}),
          salutations.findAll({raw: true}),
          address.findAll({raw: true}),
          presidency.findAll({raw: true}),
          counties.findAll({raw: true}),
          ministry.findAll({raw: true}),
          stateDepartment.findAll({raw: true}),
          parastatal.findAll({raw: true}),
          commissions.findAll({raw: true}),
          boards.findAll({raw: true}),
          privateInstitutions.findAll({raw: true}),
          learningInstitutions.findAll({raw: true}),
      ]);

      const formatContact = (contact,orgType) => {
          const organization = orgType.find(item => item.contact_id === contact.id) || {};
          const userIds = contactList.filter(item => item.contact_id === contact.id).map(item=>item.person_id)

          if (contact.contactType === "State Department"){
              organization.ministry = Ministry.find(ministry=>ministry.id === organization.ministry)
          }
          if (contact.contactType === "Parastatal"||contact.contactType === "Board"){
              organization.stateDepartment = StateDepartment.find(dpt=>dpt.id === organization.stateDepartment)
          }

          organization.headPerson = {
              person:People.find(person=>person.id === organization.headPersonId),
              salutations:Salutations.filter(item=>item.person_id===organization.headPersonId).map(sal => sal.salutation)
          }

          const uniqueUsers = [...new Set(userIds)].map(Uid=>({
              person:People.find(person => person.id === Uid) || {},
              jobs:Jobs.filter(job => job.personId === Uid),
              contacts:contactList.filter(item=>item.person_id===Uid),
              salutations:Salutations.filter(item=>item.person_id===Uid).map(sal => sal.salutation),
              organization
          }))

          return {
              ...contact,
              organization,
              address: Addresses.filter(item => item.contact_id === contact.id) || [],
              ContactList: contactList
                  .filter(item => item.contact_id === contact.id)
                  .map(cont => ({
                      ...cont,
                      contactPerson: People.find(person => person.id === cont.person_id) || {},
                      jobs: Jobs.filter(job => job.personId === cont.person_id),
                      salutations:Salutations.filter(item=>item.person_id===cont.person_id).map(sal => sal.salutation),
                  })),
              people:uniqueUsers
          };

      }

      const Contacts = ContactIds.map(contact => {
          if (Presidency.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,Presidency)
          }
          else if (Counties.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,Counties)
          }
          else if (Ministry.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,Ministry)
          }
          else if (Parastatal.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,Parastatal)
          }
          else if (StateDepartment.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,StateDepartment)
          }
          else if (PrivateInstitutions.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,PrivateInstitutions)
          }
          else if (Boards.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,Boards)
          }
          else if (Commissions.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,Commissions)
          }
          else if (LearningInstitutions.some(item=>item.contact_id === contact.id)) {
              return formatContact(contact,LearningInstitutions)
          }
          return null

      }).filter(Boolean)

      return successTransaction(res, 'read', Contacts);

  }catch (err) {
      return handleErrors(res,err)
  }
}

module.exports = {ReadContacts}