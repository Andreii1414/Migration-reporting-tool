const express = require('express');
const { checkAccessToken } = require('../middlewares/authMiddleware');
const { validateParamId } = require('../middlewares/mongooseMiddleware');
const {createReportValidator} = require('../request-validators/reportValidator');
const reportController = require('../controllers/reportController');

const router = express.Router();
//router.use(checkAccessToken);

router.post('/', createReportValidator, reportController.createReport);

module.exports = router;