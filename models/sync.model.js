const contactIdModel = require('./ContactsModel/contactId.model');
const people = require('./PeopleModel/people.model');
const user = require('./PeopleModel/users.model');
const address = require('./AddressModels/address.model');
const contact = require('./ContactsModel/contacts.model');
const ministry = require('./ministry.model');
const privateOrg = require('./private.model');
const stateCorporation = require('./stateCorporation.model');
const peopleJobs = require('./PeopleModel/personJobs.model');
const salutations = require('./PeopleModel/Salutations.model');
const shareLogs = require('./shareLogs.model')



const modelsSync = async () => {
  try {
      await contactIdModel.sync()
      await people.sync()
      await user.sync()
      await address.sync()
      await contact.sync()
      await ministry.sync()
      await privateOrg.sync()
      await stateCorporation.sync()
      await peopleJobs.sync()
      await salutations.sync()
      await shareLogs.sync()

      console.log('Models successfully synced in the database!')

      return true;


  }catch(e){
      console.error(e);
      return true
  }
}

module.exports = {modelsSync}