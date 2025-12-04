// File: /src/controllers/appControllers/productController.js
const Product = require('@/models/appModels/Product');

module.exports = {
  // Create a new product
  create: async (req, res) => {
    try {
      const { name, itemCode, category, quantity, price, tax, currency } = req.body;
      const total = Number(price) + Number(tax);

      const product = await Product.create({ name, itemCode, category, quantity, price, tax, total, currency });
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  // Read a single product by ID
  read: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  // Update a product
  update: async (req, res) => {
    try {
      const { price, tax, ...rest } = req.body;
      const total = price !== undefined && tax !== undefined ? Number(price) + Number(tax) : undefined;

      const updatedData = { ...rest };
      if (price !== undefined) updatedData.price = price;
      if (tax !== undefined) updatedData.tax = tax;
      if (total !== undefined) updatedData.total = total;

      const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  // Delete a product
  delete: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },

  // List products with optional limit
  list: async (req, res) => {
    try {
      const products = await Product.find().limit(20);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  // List all products
  listAll: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  // Search products by name or itemCode
  search: async (req, res) => {
    try {
      const { q } = req.query;
      const regex = new RegExp(q, 'i');
      const products = await Product.find({ $or: [{ name: regex }, { itemCode: regex }] });
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to search products' });
    }
  },

  // Filter products by query parameters (e.g., ?category=Electronics)
  filter: async (req, res) => {
    try {
      const filters = req.query;
      const products = await Product.find(filters);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to filter products' });
    }
  },

  // Summary: total products
  summary: async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
      res.json({ total: totalProducts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch summary' });
    }
  },
};
