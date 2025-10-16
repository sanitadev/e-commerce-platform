const Product = require('../models/Product');
const redisClient = require('../config/redis');

exports.getProducts = async (req, res) => {
  try {
    const cacheKey = 'all_products';
    
    // Check Redis cache
    redisClient.get(cacheKey, async (err, data) => {
      if (data) {
        return res.json(JSON.parse(data));
      }
      
      const products = await Product.find({});
      redisClient.setex(cacheKey, 3600, JSON.stringify(products));
      res.json(products);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    redisClient.del('all_products'); // Clear cache
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};