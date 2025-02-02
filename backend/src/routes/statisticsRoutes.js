const express = require('express');
const { checkAccessToken } = require('../middlewares/authMiddleware');
const { validateParamId } = require('../middlewares/mongooseMiddleware');
const statisticsController = require('../controllers/statisticsController');

const router = express.Router();
router.use(checkAccessToken);

router.get('/total-reports', statisticsController.getTotalReports);
router.get('/most-reported-continents', statisticsController.getMostReportedContinents);
router.get('/most-reported-countries', statisticsController.getMostReportedCountries);
router.get('/report-by-season/:season', statisticsController.getReportsBySeason);
router.get('/top-reported-species', statisticsController.getTopReportedSpecies);


module.exports = router;