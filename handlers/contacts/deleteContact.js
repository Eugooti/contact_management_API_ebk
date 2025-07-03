const {handleErrors, itemNotFound, successTransaction} = require("../../utils/errorHandlers");
const contactsModel = require('../../models/ContactsModel/contactId.model')
const peopleModel = require('../../models/PeopleModel/people.model')
const jobsModel = require('../../models/PeopleModel/personJobs.model')
const contactListModel = require('../../models/ContactsModel/contacts.model')
const addressModels = require('../../models/AddressModels/address.model')
const {Op} = require("sequelize");

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


const deleteContact = async (req,res) => {
    const sequelize = contactsModel.sequelize;
    const transaction = await sequelize.transaction();
  try {
      const id = req.params.id;

      const findContact = await contactsModel.findByPk(id)

      if (!findContact) {
          return  itemNotFound(res,'Contact')
      }

      const orgModel = organizationModels[findContact.contactType];

      await orgModel.destroy({where:{contact_id:id},transaction})

      await addressModels.destroy({where:{contact_id:id},transaction})

      const contactList = await contactListModel.findAll({where:{contact_id:id},transaction})

      const peopleId = [...new Set(contactList.map(contact => contact.person_id))]

      await peopleModel.destroy({where:{id:{[Op.in]:peopleId}},transaction})
      await jobsModel.destroy({where:{id:{[Op.in]:peopleId}},transaction})
      await contactListModel.destroy({where:{id:{[Op.in]:peopleId}},transaction})
      await findContact.destroy({transaction})

      await transaction.commit()
      return successTransaction(res,'deleted')

  }catch (err) {
      await transaction.rollback()
      return handleErrors(res,err)
  }
}

module.exports = {deleteContact}