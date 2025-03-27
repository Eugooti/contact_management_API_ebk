const {handleErrors, itemNotFound, successTransaction} = require("../../utils/errorHandlers");
const contactsModel = require('../../models/ContactsModel/contactId.model')
const ministriesModel = require('../../models/ministry.model')
const parastatalModel = require('../../models/stateCorporation.model')
const privateModel = require('../../models/private.model')
const peopleModel = require('../../models/PeopleModel/people.model')
const jobsModel = require('../../models/PeopleModel/personJobs.model')
const contactListModel = require('../../models/ContactsModel/contacts.model')
const addressModels = require('../../models/AddressModels/address.model')
const {Op} = require("sequelize");

const deleteContact = async (req,res) => {
    const sequelize = contactsModel.sequelize;
    const transaction = await sequelize.transaction();
  try {
      const id = req.params.id;

      const findContact = await contactsModel.findByPk(id)

      if (!findContact) {
          return  itemNotFound(res,'Contact')
      }

      if (findContact.contactType === "Ministry"){
          await ministriesModel.destroy({where:{contact_id:id},transaction})
      }

      if (findContact.contactType === "State Corporation"){
          await parastatalModel.destroy({where:{contact_id:id},transaction})
      }

      if (findContact.contactType === "Private"){
          await privateModel.destroy({where:{contact_id:id},transaction})
      }

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