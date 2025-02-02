const express = require('express');
const dataController = require('../controllers/dataController');
const { checkAccessToken } = require('../middlewares/authMiddleware');
const { restrictAccess } = require('../middlewares/internalAccess');

const router = express.Router();
router.use(checkAccessToken);

router.get('/',restrictAccess, dataController.getData);

module.exports = router;