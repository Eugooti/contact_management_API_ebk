const contactsId = require('./ContactsModel/contactId.model')
const users = require('./PeopleModel/users.model')
const people = require('./PeopleModel/people.model')
const salutation = require('./PeopleModel/Salutations.model')
const jobs = require('./PeopleModel/personJobs.model')

const contacts = require('./ContactsModel/contacts.model')

const address = require('./AddressModels/address.model')

const ministry = require('./Organizations/ministry.model')
const commission = require('./Organizations/commissions.model')
const stateDepartment = require('./Organizations/stateDepartment.model')
const counties = require('./Organizations/counties.model')
const board = require('./Organizations/boards.model')
const parastatal = require('./Organizations/parastatal.model')
const presidency = require('./Organizations/presidency.model')
const learningInstitutions = require('./Organizations/learningInstitution.model')
const privateInstitutions = require('./Organizations/private.model')

const shareLogs = require('./shareLogs.model')


const modelsSync = async () => {
  try {
      await contactsId.sync()
      await people.sync()
      await salutation.sync()
      await jobs.sync()
      await users.sync()
      await contacts.sync()
      await address.sync()
      await ministry.sync()
      await commission.sync()
      await stateDepartment.sync()
      await counties.sync()
      await board.sync()
      await parastatal.sync()
      await presidency.sync()
      await privateInstitutions.sync()
      await learningInstitutions.sync()
      await shareLogs.sync()

      console.log("Model sync completed")
      return true

  }catch(e){
      console.log("Error syncing models with database")
      return false
  }
}

module.exports = {modelsSync}