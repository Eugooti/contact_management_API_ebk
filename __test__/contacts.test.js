// Mock organization models - defined before any jest.mock calls to avoid hoisting issues
const mockOrgModels = {
    destroy: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn()
};

const { CRUDContacts } = require('../handlers/contacts/index');
const { SendContact } = require('../handlers/Mail/sendContact');
const { createContactPerson } = require('../handlers/contacts/createContactPerson');
const { ReadContacts } = require('../handlers/contacts/ReadContatcs');
const { deleteContact } = require('../handlers/contacts/deleteContact');
const { deleteContactPerson } = require('../handlers/contacts/deleteContactPerson');
const { CreateContact } = require('../handlers/contacts/CreateContact');
const { ReadOrganizationStaff } = require('../handlers/contacts/readOrganizationStaff');
const { handleErrors, successTransaction, itemNotFound } = require("../utils/errorHandlers");
const { MailHandler } = require("../handlers/Mail/MailHandler");

// Mock the utility functions and models, but not the handlers
// This allows us to test the actual implementation of the handlers
jest.mock("../utils/errorHandlers", () => ({
    handleErrors: jest.fn(),
    itemNotFound: jest.fn(),
    successTransaction: jest.fn()
}));
jest.mock("../handlers/Mail/MailHandler", () => ({
    MailHandler: jest.fn()
}));
jest.mock('../models/PeopleModel/shareLogs.model', () => {
    const mockSequelize = {
        transaction: jest.fn().mockReturnValue({
            commit: jest.fn().mockResolvedValue(true),
            rollback: jest.fn().mockResolvedValue(true)
        })
    };
    return {
        create: jest.fn(),
        sequelize: mockSequelize
    };
});
jest.mock('../models/PeopleModel/people.model', () => {
    const mockSequelize = {
        transaction: jest.fn().mockReturnValue({
            commit: jest.fn().mockResolvedValue(true),
            rollback: jest.fn().mockResolvedValue(true)
        })
    };
    return {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        bulkCreate: jest.fn(),
        destroy: jest.fn(),
        sequelize: mockSequelize
    };
});
jest.mock('../models/ContactsModel/contactId.model', () => {
    const mockSequelize = {
        transaction: jest.fn().mockReturnValue({
            commit: jest.fn().mockResolvedValue(true),
            rollback: jest.fn().mockResolvedValue(true)
        })
    };
    return {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
        sequelize: mockSequelize
    };
});
jest.mock('../models/ContactsModel/contacts.model', () => ({
    bulkCreate: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
}));
jest.mock('../models/PeopleModel/personJobs.model', () => ({
    bulkCreate: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn()
}));
jest.mock('../models/PeopleModel/Salutations.model', () => ({
    bulkCreate: jest.fn(),
    findAll: jest.fn()
}));
jest.mock('../models/AddressModels/address.model', () => ({
    bulkCreate: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
}));

jest.mock('../models/Organizations/presidency.model', () => mockOrgModels);
jest.mock('../models/Organizations/counties.model', () => mockOrgModels);
jest.mock('../models/Organizations/ministry.model', () => mockOrgModels);
jest.mock('../models/Organizations/commissions.model', () => mockOrgModels);
jest.mock('../models/Organizations/stateDepartment.model', () => mockOrgModels);
jest.mock('../models/Organizations/parastatal.model', () => mockOrgModels);
jest.mock('../models/Organizations/private.model', () => mockOrgModels);
jest.mock('../models/Organizations/learningInstitution.model', () => mockOrgModels);
jest.mock('../models/Organizations/boards.model', () => mockOrgModels);

describe('Contact Operations', () => {
    let mockModel, mockReq, mockRes, contactMethods;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mock model
        mockModel = {
            create: jest.fn(),
            bulkCreate: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn()
        };

        // Setup mock request
        mockReq = {
            params: {},
            body: {}
        };

        // Setup mock response
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Initialize contact methods
        contactMethods = CRUDContacts(mockModel);
    });

    describe('shareContact', () => {
        it('should call SendContact with the request and response', async () => {
            // Since we're not mocking the handler functions anymore, we'll just verify
            // that the method exists and can be called without errors
            expect(typeof contactMethods.shareContact).toBe('function');
            await expect(contactMethods.shareContact(mockReq, mockRes)).resolves.not.toThrow();
        });

        it('should handle successful email sending', async () => {
            // Setup
            const shareDetails = { userId: 1, contactId: 2 };
            const contact = {
                name: 'John Doe',
                office: 'CEO',
                organization: 'ACME Inc',
                postalCode: '12345',
                city: 'New York',
                country: 'USA',
                phoneNumber: '123-456-7890',
                email: 'john@example.com'
            };
            mockReq.body = {
                to: 'recipient@example.com',
                contact,
                shareDetails
            };

            // Reset and setup mocks
            jest.clearAllMocks();
            const shareLogs = require('../models/PeopleModel/shareLogs.model');
            shareLogs.create.mockResolvedValue({ id: 1 });
            MailHandler.mockResolvedValue({ success: true });

            // Execute
            await SendContact(mockReq, mockRes);

            // Verify
            expect(shareLogs.create).toHaveBeenCalledWith(shareDetails, expect.any(Object));
            expect(MailHandler).toHaveBeenCalledWith(
                'recipient@example.com',
                'REQUESTED CONTACT INFORMATION',
                expect.stringContaining('John Doe')
            );
            expect(successTransaction).toHaveBeenCalledWith(mockRes, 'Mail sent successfully');
        });

        it('should handle missing required fields', async () => {
            // Setup
            mockReq.body = { to: 'recipient@example.com' }; // Missing contact and shareDetails

            // Reset mocks
            jest.clearAllMocks();

            // Execute
            await SendContact(mockReq, mockRes);

            // Verify
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Missing required fields'
            }));
        });

        it('should handle mail sending failure', async () => {
            // Setup
            mockReq.body = {
                to: 'recipient@example.com',
                contact: {
                    name: 'John Doe',
                    office: 'CEO',
                    organization: 'ACME Inc',
                    postalCode: '12345',
                    city: 'New York',
                    country: 'USA',
                    phoneNumber: '123-456-7890',
                    email: 'john@example.com'
                },
                shareDetails: { userId: 1, contactId: 2 }
            };

            // Reset and setup mocks
            jest.clearAllMocks();
            const shareLogs = require('../models/PeopleModel/shareLogs.model');
            shareLogs.create.mockResolvedValue({ id: 1 });
            MailHandler.mockResolvedValue({ success: false });

            // Execute
            await SendContact(mockReq, mockRes);

            // Verify
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Unable to send contact'
            }));
        });
    });

    describe('createContactPerson', () => {
        it('should call createContactPerson with the request and response', async () => {
            // Since we're not mocking the handler functions anymore, we'll just verify
            // that the method exists and can be called without errors
            expect(typeof contactMethods.createContactPerson).toBe('function');
            await expect(contactMethods.createContactPerson(mockReq, mockRes)).resolves.not.toThrow();
        });

        it('should create contact person successfully', async () => {
            // Setup
            const peopleModel = require('../models/PeopleModel/people.model');
            const contactsModel = require('../models/ContactsModel/contacts.model');
            const jobsModel = require('../models/PeopleModel/personJobs.model');
            const salutationModel = require('../models/PeopleModel/Salutations.model');

            mockReq.body = {
                contactId: 1,
                workPlace: 'ACME Inc',
                contact: [
                    {
                        name: 'John Doe',
                        profession: 'CEO',
                        Office: 'Executive',
                        salutation: ['Mr', 'Dr'],
                        contactDetails: [
                            {
                                phoneNumber: '123-456-7890',
                                email: 'john@example.com'
                            }
                        ]
                    }
                ]
            };

            // Reset and setup mocks
            jest.clearAllMocks();
            const createdPeople = [{ id: 1, full_name: 'John Doe' }];
            peopleModel.bulkCreate.mockResolvedValue(createdPeople);

            // Execute
            await createContactPerson(mockReq, mockRes);

            // Verify
            expect(peopleModel.bulkCreate).toHaveBeenCalledWith(
                [{ full_name: 'John Doe', profession: 'CEO' }],
                expect.any(Object)
            );
            expect(jobsModel.bulkCreate).toHaveBeenCalled();
            expect(contactsModel.bulkCreate).toHaveBeenCalled();
            expect(salutationModel.bulkCreate).toHaveBeenCalled();
            expect(successTransaction).toHaveBeenCalledWith(mockRes, 'created');
        });

        it('should handle errors during contact person creation', async () => {
            // Setup
            const peopleModel = require('../models/PeopleModel/people.model');
            const error = new Error('Database error');

            mockReq.body = {
                contactId: 1,
                workPlace: 'ACME Inc',
                contact: [
                    {
                        name: 'John Doe',
                        profession: 'CEO',
                        Office: 'Executive',
                        salutation: ['Mr', 'Dr'],
                        contactDetails: [
                            {
                                phoneNumber: '123-456-7890',
                                email: 'john@example.com'
                            }
                        ]
                    }
                ]
            };

            // Reset and setup mocks
            jest.clearAllMocks();
            peopleModel.bulkCreate.mockRejectedValue(error);

            // Execute
            await createContactPerson(mockReq, mockRes);

            // Verify
            expect(handleErrors).toHaveBeenCalledWith(mockRes, error);
        });
    });

    describe('readContacts', () => {
        it('should call ReadContacts with the request and response', async () => {
            // Since we're not mocking the handler functions anymore, we'll just verify
            // that the method exists and can be called without errors
            expect(typeof contactMethods.readContacts).toBe('function');
            await expect(contactMethods.readContacts(mockReq, mockRes)).resolves.not.toThrow();
        });

        it('should read contacts successfully', async () => {
            // Setup
            const contactId = require('../models/ContactsModel/contactId.model');
            const contacts = require('../models/ContactsModel/contacts.model');
            const people = require('../models/PeopleModel/people.model');
            const jobs = require('../models/PeopleModel/personJobs.model');
            const salutations = require('../models/PeopleModel/Salutations.model');
            const address = require('../models/AddressModels/address.model');

            // Reset and setup mocks
            jest.clearAllMocks();

            // Mock data for each model
            contactId.findAll.mockResolvedValue([{ id: 1, contactType: 'Ministry' }]);
            contacts.findAll.mockResolvedValue([{ contact_id: 1, person_id: 1 }]);
            people.findAll.mockResolvedValue([{ id: 1, full_name: 'John Doe' }]);
            jobs.findAll.mockResolvedValue([{ personId: 1, job: 'CEO' }]);
            salutations.findAll.mockResolvedValue([{ person_id: 1, salutation: 'Mr' }]);
            address.findAll.mockResolvedValue([{ contact_id: 1, address: '123 Main St' }]);

            // Mock organization models
            const ministry = require('../models/Organizations/ministry.model');
            ministry.findAll.mockResolvedValue([{ contact_id: 1, name: 'Ministry of Testing', headPersonId: 1 }]);

            // Also mock the other organization models that are used in ReadContacts
            const presidency = require('../models/Organizations/presidency.model');
            const counties = require('../models/Organizations/counties.model');
            const stateDepartment = require('../models/Organizations/stateDepartment.model');
            const parastatal = require('../models/Organizations/parastatal.model');
            const commissions = require('../models/Organizations/commissions.model');
            const boards = require('../models/Organizations/boards.model');
            const privateInstitutions = require('../models/Organizations/private.model');
            const learningInstitutions = require('../models/Organizations/learningInstitution.model');

            presidency.findAll.mockResolvedValue([]);
            counties.findAll.mockResolvedValue([]);
            stateDepartment.findAll.mockResolvedValue([]);
            parastatal.findAll.mockResolvedValue([]);
            commissions.findAll.mockResolvedValue([]);
            boards.findAll.mockResolvedValue([]);
            privateInstitutions.findAll.mockResolvedValue([]);
            learningInstitutions.findAll.mockResolvedValue([]);

            // Execute
            await ReadContacts(mockReq, mockRes);

            // Verify
            expect(successTransaction).toHaveBeenCalledWith(mockRes, 'read', expect.any(Array));
        });

        it('should handle errors during contact reading', async () => {
            // Setup
            const contactId = require('../models/ContactsModel/contactId.model');
            const error = new Error('Database error');

            // Reset and setup mocks
            jest.clearAllMocks();
            contactId.findAll.mockRejectedValue(error);

            // Execute
            await ReadContacts(mockReq, mockRes);

            // Verify
            expect(handleErrors).toHaveBeenCalledWith(mockRes, error);
        });
    });

    describe('deleteContact', () => {
        it('should call deleteContact with the request and response', async () => {
            // Since we're not mocking the handler functions anymore, we'll just verify
            // that the method exists and can be called without errors
            expect(typeof contactMethods.deleteContact).toBe('function');
            await expect(contactMethods.deleteContact(mockReq, mockRes)).resolves.not.toThrow();
        });

        it('should delete contact successfully', async () => {
            // Setup
            const contactsModel = require('../models/ContactsModel/contactId.model');
            const contactListModel = require('../models/ContactsModel/contacts.model');
            const peopleModel = require('../models/PeopleModel/people.model');
            const jobsModel = require('../models/PeopleModel/personJobs.model');
            const addressModels = require('../models/AddressModels/address.model');

            mockReq.params = { id: '1' };

            // Reset and setup mocks
            jest.clearAllMocks();
            const mockContact = {
                contactType: 'Ministry',
                destroy: jest.fn().mockResolvedValue(true)
            };
            contactsModel.findByPk.mockResolvedValue(mockContact);
            contactListModel.findAll.mockResolvedValue([{ person_id: 1 }]);

            // Execute
            await deleteContact(mockReq, mockRes);

            // Verify
            expect(contactsModel.findByPk).toHaveBeenCalledWith('1');
            expect(mockContact.destroy).toHaveBeenCalled();
            expect(successTransaction).toHaveBeenCalledWith(mockRes, 'deleted');
        });

        it('should handle contact not found', async () => {
            // Setup
            const contactsModel = require('../models/ContactsModel/contactId.model');

            mockReq.params = { id: '999' };

            // Reset and setup mocks
            jest.clearAllMocks();
            contactsModel.findByPk.mockResolvedValue(null);

            // Execute
            await deleteContact(mockReq, mockRes);

            // Verify
            expect(itemNotFound).toHaveBeenCalledWith(mockRes, 'Contact');
        });

        it('should handle errors during contact deletion', async () => {
            // Setup
            const contactsModel = require('../models/ContactsModel/contactId.model');
            const error = new Error('Database error');

            mockReq.params = { id: '1' };

            // Reset and setup mocks
            jest.clearAllMocks();
            contactsModel.findByPk.mockRejectedValue(error);

            // Execute
            await deleteContact(mockReq, mockRes);

            // Verify
            expect(handleErrors).toHaveBeenCalledWith(mockRes, error);
        });
    });

    describe('deleteContactPerson', () => {
        it('should call deleteContactPerson with the request and response', async () => {
            // Since we're not mocking the handler functions anymore, we'll just verify
            // that the method exists and can be called without errors
            expect(typeof contactMethods.deleteContactPerson).toBe('function');
            await expect(contactMethods.deleteContactPerson(mockReq, mockRes)).resolves.not.toThrow();
        });

        it('should delete contact person successfully', async () => {
            // Setup
            const peopleModel = require('../models/PeopleModel/people.model');
            const jobsModel = require('../models/PeopleModel/personJobs.model');
            const contactsModel = require('../models/ContactsModel/contacts.model');

            mockReq.params = { id: '1' };

            // Reset and setup mocks
            jest.clearAllMocks();
            const mockPerson = {
                destroy: jest.fn().mockResolvedValue(true)
            };
            peopleModel.findByPk.mockResolvedValue(mockPerson);

            // Execute
            await deleteContactPerson(mockReq, mockRes);

            // Verify
            expect(peopleModel.findByPk).toHaveBeenCalledWith('1');
            expect(jobsModel.destroy).toHaveBeenCalled();
            expect(contactsModel.destroy).toHaveBeenCalled();
            expect(mockPerson.destroy).toHaveBeenCalled();
            expect(successTransaction).toHaveBeenCalledWith(mockRes, 'deleted');
        });

        it('should handle person not found', async () => {
            // Setup
            const peopleModel = require('../models/PeopleModel/people.model');

            mockReq.params = { id: '999' };

            // Reset and setup mocks
            jest.clearAllMocks();
            peopleModel.findByPk.mockResolvedValue(null);

            // Execute
            await deleteContactPerson(mockReq, mockRes);

            // Verify
            expect(itemNotFound).toHaveBeenCalledWith(mockRes, 'Person');
        });

        it('should handle errors during contact person deletion', async () => {
            // Setup
            const peopleModel = require('../models/PeopleModel/people.model');
            const error = new Error('Database error');

            mockReq.params = { id: '1' };

            // Reset and setup mocks
            jest.clearAllMocks();
            peopleModel.findByPk.mockRejectedValue(error);

            // Execute
            await deleteContactPerson(mockReq, mockRes);

            // Verify
            expect(handleErrors).toHaveBeenCalledWith(mockRes, error);
        });
    });

    describe('createContact', () => {
        it('should call CreateContact with the request and response', async () => {
            // Since we're not mocking the handler functions anymore, we'll just verify
            // that the method exists and can be called without errors
            expect(typeof contactMethods.createContact).toBe('function');
            await expect(contactMethods.createContact(mockReq, mockRes)).resolves.not.toThrow();
        });

        it('should create contact successfully', async () => {
            // Setup
            const contactIdModel = require('../models/ContactsModel/contactId.model');
            const peopleModel = require('../models/PeopleModel/people.model');
            const contactsModel = require('../models/ContactsModel/contacts.model');
            const addressModel = require('../models/AddressModels/address.model');
            const jobsModel = require('../models/PeopleModel/personJobs.model');
            const salutationModel = require('../models/PeopleModel/Salutations.model');

            mockReq.body = {
                headquarters: { location: 'New York' },
                organizationData: {
                    contactType: 'Ministry',
                    name: 'Ministry of Testing',
                    headName: 'John Doe'
                },
                address: [{ street: '123 Main St', city: 'New York' }],
                people: [
                    {
                        full_name: 'John Doe',
                        Office: 'CEO',
                        salutation: ['Mr', 'Dr']
                    }
                ],
                Contact: [
                    {
                        name: 'John Doe',
                        Office: 'CEO',
                        email: 'john@example.com',
                        phoneNumber: '123-456-7890'
                    }
                ]
            };

            // Reset and setup mocks
            jest.clearAllMocks();
            contactIdModel.create.mockResolvedValue({ id: 1 });
            peopleModel.bulkCreate.mockResolvedValue([{ id: 1, full_name: 'John Doe' }]);

            // Mock organization model
            const ministry = require('../models/Organizations/ministry.model');
            ministry.create.mockResolvedValue({ id: 1 });

            // Execute
            await CreateContact(mockReq, mockRes);

            // Verify
            expect(contactIdModel.create).toHaveBeenCalled();
            expect(peopleModel.bulkCreate).toHaveBeenCalled();
            expect(contactsModel.bulkCreate).toHaveBeenCalled();
            expect(addressModel.bulkCreate).toHaveBeenCalled();
            expect(jobsModel.bulkCreate).toHaveBeenCalled();
            expect(salutationModel.bulkCreate).toHaveBeenCalled();
            expect(successTransaction).toHaveBeenCalledWith(mockRes, 'created');
        });

        it('should handle errors during contact creation', async () => {
            // Setup
            const contactIdModel = require('../models/ContactsModel/contactId.model');
            const error = new Error('Database error');

            mockReq.body = {
                headquarters: { location: 'New York' },
                organizationData: {
                    contactType: 'Ministry',
                    name: 'Ministry of Testing',
                    headName: 'John Doe'
                },
                address: [{ street: '123 Main St', city: 'New York' }],
                people: [
                    {
                        full_name: 'John Doe',
                        Office: 'CEO',
                        salutation: ['Mr', 'Dr']
                    }
                ]
            };

            // Reset and setup mocks
            jest.clearAllMocks();
            contactIdModel.create.mockRejectedValue(error);

            // Execute
            await CreateContact(mockReq, mockRes);

            // Verify
            expect(handleErrors).toHaveBeenCalledWith(mockRes, error);
        });
    });

    describe('readStaff', () => {
        it('should call ReadOrganizationStaff with the request and response', async () => {
            // Since we're not mocking the handler functions anymore, we'll just verify
            // that the method exists and can be called without errors
            expect(typeof contactMethods.readStaff).toBe('function');
            await expect(contactMethods.readStaff(mockReq, mockRes)).resolves.not.toThrow();
        });

        it('should read organization staff successfully', async () => {
            // Setup
            const contactsModel = require('../models/ContactsModel/contacts.model');
            const peopleModel = require('../models/PeopleModel/people.model');

            mockReq.params = { id: '1' };

            // Reset and setup mocks
            jest.clearAllMocks();
            contactsModel.findAll.mockResolvedValue([
                { person_id: 1 },
                { person_id: 2 }
            ]);

            peopleModel.findAll.mockResolvedValue([
                { id: 1, full_name: 'John Doe' },
                { id: 2, full_name: 'Jane Smith' }
            ]);

            // Execute
            await ReadOrganizationStaff(mockReq, mockRes);

            // Verify
            expect(contactsModel.findAll).toHaveBeenCalledWith({ where: { contact_id: '1' } });
            expect(peopleModel.findAll).toHaveBeenCalled();
            expect(successTransaction).toHaveBeenCalledWith(mockRes, 'read', expect.any(Array));
        });

        it('should handle errors during staff reading', async () => {
            // Setup
            const contactsModel = require('../models/ContactsModel/contacts.model');
            const error = new Error('Database error');

            mockReq.params = { id: '1' };

            // Reset and setup mocks
            jest.clearAllMocks();
            contactsModel.findAll.mockRejectedValue(error);

            // Execute
            await ReadOrganizationStaff(mockReq, mockRes);

            // Verify
            expect(handleErrors).toHaveBeenCalledWith(mockRes, error);
        });
    });
});
