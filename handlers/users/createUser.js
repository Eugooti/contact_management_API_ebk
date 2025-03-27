const {handleErrors, successTransaction} = require("../../utils/errorHandlers");
const bcrypt = require("bcrypt");

const CreateUser =async (model,req,res) => {
  try {

      const {email} = req.body;
      const saltRounds = 10;
      const password = await bcrypt.hash(email, saltRounds);
      const user = {...req.body,password}

      const createUser = await model.create(user);

      if (user) {
          return  successTransaction(res,"Created")
      }

  }catch(err){
      return handleErrors(res,err)
  }
}

module.exports = {CreateUser};