const express = require('express');
const graphdbController = require('../controllers/graphdbController');
const { checkAccessToken } = require('../middlewares/authMiddleware');
const { validateParamId } = require('../middlewares/mongooseMiddleware');

const router = express.Router();
//router.use(checkAccessToken);

router.get('/total-reports', graphdbController.getTotalReports);
router.get('/most-reported-continents', graphdbController.getMostReportedContinents);
router.get('/most-reported-countries', graphdbController.getMostReportedCountries);
router.get('/report-by-season/:season', graphdbController.getReportsBySeason);
router.get('/top-reported-species', graphdbController.getTopReportedSpecies);

module.exports = router;
