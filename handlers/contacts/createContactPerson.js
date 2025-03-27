const { handleErrors, successTransaction } = require("../../utils/errorHandlers");
const contactsModel = require('../../models/ContactsModel/contacts.model');
const peopleModel = require('../../models/PeopleModel/people.model');
const jobsModel = require('../../models/PeopleModel/personJobs.model');
const salutationModel = require('../../models/PeopleModel/Salutations.model');

const createContactPerson = async (req, res) => {
    const sequelize = peopleModel.sequelize;
    const transaction = await sequelize.transaction();

    try {
        const { contactId, workPlace, contact } = req.body;
        // Prepare PeopleModel Data
        const peopleData = contact.map(item => ({
            full_name: item.name,
            profession: item.profession,
        }));

        // Insert PeopleModel Data
        const createdPeople = await peopleModel.bulkCreate(peopleData, { transaction });

        // Create a mapping of person name to ID for quick lookup
        const personMap = new Map(createdPeople.map(person => [person.full_name, person.id]));

        // Format Contact Details
        const formattedContacts = contact.flatMap(item =>
            item.contactDetails.map(cont => ({
                contact_id: contactId,
                person_id: personMap.get(item.name),
                office: item.Office,
                phone_number: cont.phoneNumber,
                ...cont,
            }))
        );

        // Prepare Salutation Data
        const salutationData = contact.flatMap(item =>
            item.salutation.map(salutation => ({
                person_id: personMap.get(item.name),
                salutation,
            }))
        );

        // Prepare Job Data
        const jobData = contact.map(item => ({
            personId: personMap.get(item.name),
            job: item.Office,
            workPlace,
        }));

        // Insert Data into Respective Tables
        await Promise.all([
            jobsModel.bulkCreate(jobData, { transaction }),
            contactsModel.bulkCreate(formattedContacts, { transaction }),
            salutationModel.bulkCreate(salutationData, { transaction })
        ]);

        // Commit Transaction
        await transaction.commit();
        return successTransaction(res, "created");

    } catch (err) {
        await transaction.rollback();
        return handleErrors(res, err);
    }
};

module.exports = { createContactPerson };
