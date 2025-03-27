const {handleErrors, itemNotFound, successTransaction} = require("../../utils/errorHandlers");
const bcrypt = require("bcrypt");

const ChangePassword = async (model,req,res) => {
    try {
        const id = req.params.id;
        const {password,newPassword} = req.body;
        const user = await model.findByPk(id)
        if (!user) return itemNotFound(res,"User");

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return res.status(404).json({
            success: false,
            message: "Password doesn't match"
        })

        const saltRounds = 10
        user.password = await bcrypt.hash(newPassword, saltRounds);

        await user.save();

        return successTransaction(res,'updated')



    }catch(err){
        return handleErrors(res,err)
    }
}

module.exports = {ChangePassword}