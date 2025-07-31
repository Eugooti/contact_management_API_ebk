const {CRUDMethods} = require("../CRUD");
const {CreateUser} = require("./createUser");
const {ReadUser} = require("./readUser");
const UsersMethods = (model) => {
    const methods = CRUDMethods(model)

    methods.createUser = async (req, res) => {
        await CreateUser(model,req,res)
    }

    methods.readUsers = async (req,res)=>{
        await ReadUser(req,res,model)
    }

    return methods
}

module.exports = {UsersMethods}