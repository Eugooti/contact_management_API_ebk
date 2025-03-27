const router = require("express").Router();
const boardsController = require("..//controller/OrganizationController/boards.controller");
const commissionsController = require("..//controller/OrganizationController/commissions.controller");
const countiesController = require("..//controller/OrganizationController/counties.controller");
const learningInstitutionsController = require("..//controller/OrganizationController/learningInstitutioin.controller");
const ministryController = require("..//controller/OrganizationController/ministry.controller");
const parastatalController = require("..//controller/OrganizationController/parastatal.controller");
const presidencyController = require("..//controller/OrganizationController/presidency.controller");
const privateController = require("..//controller/OrganizationController/private.controller");
const stateDepartmentController = require("..//controller/OrganizationController/stateDepartment.controller");
const {catchErrors} = require("../utils/errorHandlers");


router.route('/boards/update/:id').put(catchErrors(boardsController.update))
router.route('/commission/update/:id').put(catchErrors(commissionsController.update))
router.route('/counties/update/:id').put(catchErrors(countiesController.update))
router.route('/learningInstitution/update/:id').put(catchErrors(learningInstitutionsController.update))
router.route('/ministry/update/:id').put(catchErrors(ministryController.update))
router.route('/ministry/read').get(catchErrors(ministryController.read))
router.route('/parastatal/update/:id').put(catchErrors(parastatalController.update))
router.route('/presidency/update/:id').put(catchErrors(presidencyController.update))
router.route('/private/update/:id').put(catchErrors(privateController.update))
router.route('/stateDepartment/update/:id').put(catchErrors(stateDepartmentController.update))
router.route('/stateDepartment/read').get(catchErrors(stateDepartmentController.read))

module.exports = router;
