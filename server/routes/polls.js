const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.get('/', pollController.listPastPolls);
router.get('/:id', pollController.getPollById);

module.exports = router;
