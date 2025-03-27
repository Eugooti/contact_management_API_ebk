const {handleErrors, itemNotFound, successTransaction} = require("../../utils/errorHandlers");
const peopleModel = require('../../models/PeopleModel/people.model');
const jobsModel = require('../../models/PeopleModel/personJobs.model');
const contactsModel = require('../../models/ContactsModel/contacts.model');

const deleteContactPerson = async (req,res) => {
    const sequelize = peopleModel.sequelize;
    const transaction = await sequelize.transaction();
    try {
        const id = req.params.id;

        const person = await peopleModel.findByPk(id)

        if (!person) {
            return itemNotFound(res,'Person')
        }
        await jobsModel.destroy({where:{personId:id},transaction})
        await contactsModel.destroy({where:{person_id:id},transaction})
        await person.destroy({transaction});

        await transaction.commit()
        return successTransaction(res,'deleted')
    }catch(err) {
        await transaction.rollback()
        return handleErrors(res,err)
    }

}

module.exports = {deleteContactPerson};