const { handleErrors, successTransaction } = require("../../utils/errorHandlers");
const ContactIdsModel = require('../../models/ContactsModel/contactId.model');
const MinistryModel = require('../../models/ministry.model');
const ParastatalModel = require('../../models/stateCorporation.model');
const PrivateModel = require('../../models/private.model');
const AddressModel = require('../../models/AddressModels/address.model');
const ContactsModel = require('../../models/ContactsModel/contacts.model');
const PeopleModel = require('../../models/PeopleModel/people.model');
const PeopleJobsModel = require('../../models/PeopleModel/personJobs.model');
const SalutationModel = require('../../models/PeopleModel/Salutations.model');

const ReadContacts = async (req, res) => {
    try {
        // Fetch all data concurrently
        const [
            contactList,
            ministries,
            parastatals,
            privates,
            addresses,
            contactsList,
            peopleList,
            jobsList,
            salutation
        ] = await Promise.all([
            ContactIdsModel.findAll({ raw: true }),
            MinistryModel.findAll({ raw: true }),
            ParastatalModel.findAll({ raw: true }),
            PrivateModel.findAll({ raw: true }),
            AddressModel.findAll({ raw: true }),
            ContactsModel.findAll({ raw: true }),
            PeopleModel.findAll({ raw: true }),
            PeopleJobsModel.findAll({ raw: true }),
            SalutationModel.findAll({ raw: true })
        ]);

        // Helper function to structure contact data
        const formatContact = (contact, orgType) => {
            const organization = orgType.find(item => item.contact_id === contact.id) || {};

            const userIds = contactsList.filter(item => item.contact_id === contact.id).map(item=>item.person_id)

            const uniqueUsers = [...new Set(userIds)].map(Uid=>({
                person:peopleList.find(person => person.id === Uid) || {},
                jobs:jobsList.filter(job => job.personId === Uid),
                contacts:contactsList.filter(item=>item.person_id===Uid),
                salutations:salutation.filter(item=>item.person_id===Uid),
                organization
            }))

            return {
                ...contact,
                organization,
                address: addresses.filter(item => item.contact_id === contact.id) || [],
                ContactList: contactsList
                    .filter(item => item.contact_id === contact.id)
                    .map(cont => ({
                        ...cont,
                        contactPerson: peopleList.find(person => person.id === cont.person_id) || {},
                        jobs: jobsList.filter(job => job.personId === cont.person_id),
                    })),
                people:uniqueUsers
            };
        };

        // Map contacts to their corresponding organization type
        const contacts = contactList.map(contact => {
            if (ministries.some(item => item.contact_id === contact.id)) {
                return formatContact(contact, ministries);
            } else if (privates.some(item => item.contact_id === contact.id)) {
                return formatContact(contact, privates);
            } else if (parastatals.some(item => item.contact_id === contact.id)) {
                return formatContact(contact, parastatals);
            }
            return null; // Exclude contacts that don't match any category
        }).filter(Boolean); // Remove null values

        return successTransaction(res, 'read', contacts);
    } catch (error) {
        console.error("Error in ReadContacts:", error);
        return handleErrors(res, error);
    }
};

module.exports = { ReadContacts };
