const express = require('express')
const userController = require('../controller/user.controller')
const {catchErrors} = require("../utils/errorHandlers");

const router = express.Router()

router.route('/users/create').post(catchErrors(userController.createUser))
router.route('/users/read').get(catchErrors(userController.read))
router.route('/users/update/:id').put(catchErrors(userController.update))
router.route('/users/delete/:id').delete(catchErrors(userController.delete))

module.exports = router
