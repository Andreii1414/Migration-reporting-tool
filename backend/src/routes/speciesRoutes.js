const express = require('express');
const { checkAccessToken } = require('../middlewares/authMiddleware');
const { validateParamId } = require('../middlewares/mongooseMiddleware');
const {createSpeciesValidator} = require('../request-validators/speciesValidator');
const speciesController = require('../controllers/speciesController');

const router = express.Router();
//router.use(checkAccessToken);

router.get('/', speciesController.getSpecies);
router.get('/:id', validateParamId, speciesController.getSpeciesById);

module.exports = router;
