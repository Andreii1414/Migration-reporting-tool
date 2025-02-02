const express = require('express');
const { checkAccessToken } = require('../middlewares/authMiddleware');
const { validateParamId } = require('../middlewares/mongooseMiddleware');
const {createSpeciesValidator} = require('../request-validators/speciesValidator');
const speciesController = require('../controllers/speciesController');
const { restrictAccess } = require('../middlewares/internalAccess');

const router = express.Router();
router.use(checkAccessToken);

router.get('/', speciesController.getSpecies);
router.get('/:id', validateParamId, speciesController.getSpeciesById);
router.post('/', createSpeciesValidator,restrictAccess, speciesController.createSpecies);
router.put('/:id', validateParamId,restrictAccess, speciesController.updateSpecies);
router.delete('/:id', validateParamId,restrictAccess, speciesController.deleteSpecies);

module.exports = router;
