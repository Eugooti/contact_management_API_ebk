const express = require('express')
const authController = require('../controller/auth.controller')
const {catchErrors} = require("../utils/errorHandlers");
const {refreshAccessToken} = require("../config/auth/refreshTokens");

const router = express.Router()

router.route('/auth/login').post(catchErrors(authController.Login))
router.route('/auth/changePassword/:id').put(catchErrors(authController.changePassword))
router.route('/auth/logout').get(catchErrors(authController.logout))
router.route('/auth/refreshToken').post(catchErrors(refreshAccessToken))

module.exports = router