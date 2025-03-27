const router = require('express').Router();
const ContactController = require('../controller/contacts.controller')
const {catchErrors} = require("../utils/errorHandlers");
const contactPersonController = require('../controller/contacts.controller');
const jobsController = require('../controller/jobs.controller');
const addressController = require('../controller/address.controller');


/**
 * create contacts
 **/
router.route('/contact/create').post(catchErrors(ContactController.createContact))

/**
 * read and share and delete contacts
 **/
router.route('/contacts/read').get(catchErrors(ContactController.readContacts))
router.route('/contact/send').post(catchErrors(ContactController.shareContact));
router.route('/contact/delete/:id').delete(catchErrors(ContactController.deleteContact));


/**
 * contact person management routes
 **/

router.route('/contactPerson/create').post(catchErrors(contactPersonController.createContactPerson));
router.route('/contactPerson/delete/:id').delete(catchErrors(contactPersonController.deleteContactPerson));
router.route('/contactPerson/update/:id').put(catchErrors(contactPersonController.update));

/**
 * contact items management routes
 **/
router.route('/contactItem/create').post(catchErrors(ContactController.createMany))
router.route('/contactItem/update/:id').put(catchErrors(ContactController.update))
router.route('/contactItem/delete/:id').delete(catchErrors(ContactController.delete))


/**
 * contact person jobs
 **/
router.route('/jobs/create').post(catchErrors(jobsController.createMany))
router.route('/jobs/delete/:id').delete(catchErrors(jobsController.delete))

/**
 * organization address
 **/

router.route('/address/create').post(catchErrors(addressController.create))
router.route('/address/update/:id').put(catchErrors(addressController.update))
router.route('/address/delete/:id').delete(catchErrors(addressController.delete))


/**
 * organization staff
 **/

router.route('/organization/staff/:id').get(catchErrors(ContactController.readStaff))


module.exports = router