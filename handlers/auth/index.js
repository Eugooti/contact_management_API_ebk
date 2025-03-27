const {Login} = require("./login");
const {ChangePassword} = require("./changePassword");
const {logout} = require("./LogOut");
const AuthHandler = (model) => {
  const methods ={}

    methods.Login = async (req,res,next)=>{
      await Login(req,res,next)
    }

    methods.changePassword = async (req,res)=>{
      await ChangePassword(model,req,res)
    }

    methods.logout = async (req,res)=>{
      await logout(req,res)
    }

    return methods;

}
module.exports = {AuthHandler};