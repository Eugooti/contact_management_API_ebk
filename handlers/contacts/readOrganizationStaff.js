const {handleErrors, successTransaction} = require("../../utils/errorHandlers");
const contactsModel = require('../../models/ContactsModel/contacts.model')
const peopleModel = require('../../models/PeopleModel/people.model')
const {Op} = require('sequelize');
const ReadOrganizationStaff = async (req,res) => {
  try {
      const {id} = req.params;
      const organizationContacts = await contactsModel.findAll({where:{contact_id:id}});

      const peopleId = [...new Set(organizationContacts.map(contact => contact.person_id))];

      const result = await peopleModel.findAll({where:{id:{[Op.in]:peopleId}}});

      return successTransaction(res,'read',result)

  }catch(err){
      return handleErrors(res,err)
  }
}

module.exports = {ReadOrganizationStaff}