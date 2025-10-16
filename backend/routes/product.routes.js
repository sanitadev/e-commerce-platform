const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct } = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct);

module.exports = router;