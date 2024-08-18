const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.get('/', bookController.list);
router.get('/statuses', bookController.getBookStatuses);
router.post('/', bookController.register);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.delete);

module.exports = router;
