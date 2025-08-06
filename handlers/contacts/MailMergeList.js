const { handleErrors, successTransaction } = require("../../utils/errorHandlers");
const contactId = require('../../models/ContactsModel/contactId.model');
const contacts = require('../../models/ContactsModel/contacts.model');
const people = require('../../models/PeopleModel/people.model');
const jobs = require('../../models/PeopleModel/personJobs.model');
const salutations = require('../../models/PeopleModel/Salutations.model');
const address = require('../../models/AddressModels/address.model');
const presidency = require('../../models/Organizations/presidency.model');
const counties = require('../../models/Organizations/counties.model');
const ministry = require('../../models/Organizations/ministry.model');
const stateDepartment = require('../../models/Organizations/stateDepartment.model');
const parastatal = require('../../models/Organizations/parastatal.model');
const commissions = require('../../models/Organizations/commissions.model');
const boards = require('../../models/Organizations/boards.model');
const privateInstitutions = require('../../models/Organizations/private.model');
const learningInstitutions = require('../../models/Organizations/learningInstitution.model');

// Helper function to create lookup maps
const createLookupMap = (list, key) =>
    list.reduce((map, item) => {
        map[item[key]] = item;
        return map;
    }, {});

// Strategy pattern for organization handling
const organizationStrategies = {
    Presidency: {
        model: presidency,
        key: 'contact_id',
        nameField: 'name',
        locationField: 'city'
    },
    County: {
        model: counties,
        key: 'contact_id',
        nameField: 'county',
        locationField: 'county'
    },
    Ministry: {
        model: ministry,
        key: 'contact_id',
        nameField: 'name',
        locationField: 'city'
    },
    'State Department': {
        model: stateDepartment,
        key: 'contact_id',
        nameField: 'name',
        locationField: 'city'
    },
    Parastatal: {
        model: parastatal,
        key: 'contact_id',
        nameField: 'name',
        locationField: 'city'
    },
    Commission: {
        model: commissions,
        key: 'contact_id',
        nameField: 'name',
        locationField: 'city'
    },
    Board: {
        model: boards,
        key: 'contact_id',
        nameField: 'name',
        locationField: 'city'
    },
    'Private Institution': {
        model: privateInstitutions,
        key: 'contact_id',
        nameField: 'name',
        locationField: 'city'
    },
    'Learning Institution': {
        model: learningInstitutions,
        key: 'contact_id',
        nameField: 'name',
        locationField: 'city'
    }
};

const MailMergeList = async (req, res) => {
    try {
        // Validate request
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const contactTypeFilter = req.query.contactType;

        // Fetch only needed fields concurrently
        const [
            ContactIds,
            contactList,
            People,
            Jobs,
            Salutations
        ] = await Promise.all([
            contactId.findAll({
                attributes: ['id', 'contactType'],
                where: contactTypeFilter ? { contactType: contactTypeFilter } : {},
                raw: true
            }),
            contacts.findAll({
                attributes: ['id', 'contact_id', 'person_id', 'email'],
                raw: true
            }),
            people.findAll({
                attributes: ['id', 'full_name'],
                raw: true
            }),
            jobs.findAll({
                attributes: ['personId', 'job'],
                raw: true
            }),
            salutations.findAll({
                attributes: ['person_id', 'salutation'],
                raw: true
            })
        ]);

        // Create lookup maps for O(1) access
        const contactIdMap = createLookupMap(ContactIds, 'id');
        const peopleMap = createLookupMap(People, 'id');
        const jobsMap = Jobs.reduce((map, job) => {
            if (!map[job.personId]) {
                map[job.personId] = [];
            }
            map[job.personId].push(job);
            return map;
        }, {});
        const salutationsMap = Salutations.reduce((map, salutation) => {
            if (!map[salutation.person_id]) {
                map[salutation.person_id] = [];
            }
            map[salutation.person_id].push(salutation.salutation);
            return map;
        }, {});

        // Fetch organizations only for needed contact types
        const neededOrgTypes = [...new Set(ContactIds.map(c => c.contactType))];
        const orgPromises = neededOrgTypes.map(type => {
            const strategy = organizationStrategies[type];
            if (!strategy) return Promise.resolve([]);
            return strategy.model.findAll({
                attributes: ['contact_id', strategy.nameField, 'postalCode', strategy.locationField],
                raw: true
            });
        });

        const orgResults = await Promise.all(orgPromises);
        const orgMaps = neededOrgTypes.reduce((acc, type, index) => {
            acc[type] = createLookupMap(orgResults[index], 'contact_id');
            return acc;
        }, {});

        // Transform contacts
        const mailMergeList = contactList.map((contact, index) => {
            const contact_id = contactIdMap[contact.contact_id];
            if (!contact_id) return null;

            const person = peopleMap[contact.person_id];
            const personJobs = jobsMap[contact.person_id] || [];
            const personSalutations = salutationsMap[contact.person_id] || [];

            const orgStrategy = organizationStrategies[contact_id.contactType];
            const org = orgStrategy ? orgMaps[contact_id.contactType][contact.contact_id] : null;

            return {
                no: index + 1,
                contactType: contact_id.contactType,
                name: personSalutations.length > 0
                    ? `${personSalutations.join(', ')} ${person?.full_name}`
                    : person?.full_name,
                position: personJobs[0]?.job || '',
                organization: org ? org[orgStrategy.nameField] : '',
                postalAddress: org?.postalCode ? `P.O Box ${org.postalCode}` : '',
                location: org ? org[orgStrategy.locationField] : '',
                email: contact.email
            };
        }).filter(Boolean); // Remove any null entries

        // Pagination
        const totalCount = mailMergeList.length;
        const paginatedData = mailMergeList.slice(
            (page - 1) * limit,
            page * limit
        );

        return successTransaction(res, "read", {
            data: paginatedData,
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (err) {
        console.error('MailMergeList error:', err);
        return handleErrors(res, err);
    }
};

module.exports = { MailMergeList };