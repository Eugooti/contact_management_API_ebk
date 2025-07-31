const {handleErrors, successTransaction} = require("../../utils/errorHandlers");
const ReadUser = async (req,res,model) => {
  try {
      const users = await model.findAll({
          attributes: {exclude: ['password']},
      });

      const roleName = (role)=>{
          if (role==="ADMIN")return "Admin"
          else return "User"
      }

      const formatUsers = users.map(user => ({
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          designation: user.designation,
          phoneNumber: user.phoneNumber,
          role: roleName(user.role),
          id: user.id,
      }))

      return successTransaction(res,'read',formatUsers)

  }catch(err){
      return handleErrors(res,err)
  }
}

module.exports = {ReadUser};