const {CRUDMethods} = require("../CRUD");
const {CreateUser} = require("./createUser");
const UsersMethods = (model) => {
    const methods = CRUDMethods(model)

    methods.createUser = async (req, res) => {
        await CreateUser(model,req,res)
    }

    return methods
}

module.exports = {UsersMethods}