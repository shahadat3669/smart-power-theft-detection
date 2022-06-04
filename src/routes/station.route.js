const express = require('express');

const stationController = require('../controllers/station.controller');

const router = express.Router();

router.get('/', stationController.findAll);
router.post('/update', stationController.updateAll);
// router.post('/', stationController.create);
// router.get('/:id', stationController.findOne);
// router.put('/:id', stationController.update);
// router.delete('/:id', stationController.delete);
// router.get('/', authMiddleware, deviceController.findAll);
// router.post('/', authMiddleware, deviceController.create);
// router.get('/:id', authMiddleware, deviceController.findOne);
// router.put('/:id', authMiddleware, deviceController.update);
// router.delete('/:id', authMiddleware, deviceController.delete);
module.exports = router;
