const express = require('express');
const router = express.Router();
const { createPayment, executePayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/create', protect, createPayment);
router.post('/execute', protect, executePayment);

module.exports = router;