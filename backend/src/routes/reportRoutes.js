const express = require('express');
const { checkAccessToken } = require('../middlewares/authMiddleware');
const { validateParamId } = require('../middlewares/mongooseMiddleware');
const {createReportValidator} = require('../request-validators/reportValidator');
const reportController = require('../controllers/reportController');
const {restrictAccess} = require('../middlewares/internalAccess');

const router = express.Router();
router.use(checkAccessToken);

router.post('/', createReportValidator, reportController.createReport);
router.get('/', reportController.getReportsBySeasonAndSpecies);
router.put('/:id', validateParamId,restrictAccess, reportController.updateReport);
router.delete('/:id', validateParamId,restrictAccess, reportController.deleteReport);

module.exports = router;