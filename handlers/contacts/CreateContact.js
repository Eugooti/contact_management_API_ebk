const { handleErrors, successTransaction } = require("../../utils/errorHandlers");
const contactIdModel = require("../../models/ContactsModel/contactId.model");
const peopleModel = require("../../models/PeopleModel/people.model");
const contactsModel = require("../../models/ContactsModel/contacts.model");
const addressModel = require("../../models/AddressModels/address.model");
const jobsModel = require("../../models/PeopleModel/personJobs.model");
const salutationModel = require("../../models/PeopleModel/Salutations.model");

// Organization models
const organizationModels = {
    "Presidency": require("../../models/Organizations/presidency.model"),
    "County": require("../../models/Organizations/counties.model"),
    "Ministry": require("../../models/Organizations/ministry.model"),
    "Commission": require("../../models/Organizations/commissions.model"),
    "State Department": require("../../models/Organizations/stateDepartment.model"),
    "Parastatal": require("../../models/Organizations/parastatal.model"),
    "Private": require("../../models/Organizations/private.model"),
    "Learning Institution": require("../../models/Organizations/learningInstitution.model"),
    "Board":require('../../models/Organizations/boards.model')
};

const CreateContact = async (req, res) => {
    const sequelize = contactIdModel.sequelize;
    const transaction = await sequelize.transaction();
    try {
        const { headquarters, organizationData, address, people, Contact } = req.body;
        const { contactType,headName } = organizationData;

        // Create Contact ID
        const contactId = await contactIdModel.create({ contactType, activeState: true }, { transaction });
        if (!contactId) throw new Error("Failed to create contact ID");

        // Insert PeopleModel
        const addPeople = await peopleModel.bulkCreate(people, { transaction });

        // Create lookup map for quick reference
        const peopleMap = addPeople.reduce((map, person) => {
            map[person.full_name] = person;
            return map;
        }, {});

        // Format jobs data
        const peopleJob = people.map(item => {
            const person = peopleMap[item.full_name];
            return person ? { job: item.Office, personId: person.id, workPlace: organizationData.name } : null;
        }).filter(Boolean);

        // Format salutations
        const peopleSalutation = people.flatMap(item => {
            const person = peopleMap[item.full_name];
            return person ? item.salutation.map(sal => ({ salutation: sal, person_id: person.id })) : [];
        });
        const headPersonId = addPeople.find(p=>p.full_name===headName)?.id


        // Prepare organization data
        const OrganizationData = {
            contact_id: contactId.id,
            ...organizationData,
            ...headquarters,
            headPersonId
        };

        // Select and create the appropriate organization type
        const orgModel = organizationModels[contactType];
        if (!orgModel) throw new Error("Invalid contact type provided");
        await orgModel.create(OrganizationData, { transaction });

        // Format contact list data
        const contactListData = Contact?.length ? Contact.map(item => {
            const personMatch = peopleMap[item.name];
            return personMatch ? {
                contact_id: contactId.id,
                person_id: personMatch.id,
                office: item.Office,
                email: item.email,
                phone_number: item.phoneNumber
            } : null;
        }).filter(Boolean) : [];

        console.log(contactListData)

        // Format address data
        const formatAddress = address?.length ? address.map(item => ({ ...item, contact_id: contactId.id })) : [];

        // Execute bulk inserts in parallel where possible
        if (contactListData.length)await contactsModel.bulkCreate(contactListData, { transaction });
        if (formatAddress.length) await addressModel.bulkCreate(formatAddress, { transaction });
        if (peopleJob.length) await jobsModel.bulkCreate(peopleJob, { transaction });
        if (peopleSalutation.length) await salutationModel.bulkCreate(peopleSalutation, { transaction });

        // Commit transaction
        await transaction.commit();
        return successTransaction(res, "created");
    } catch (err) {
        console.log(err)
        await transaction.rollback();
        return handleErrors(res, err);
    }
};

module.exports = { CreateContact };
