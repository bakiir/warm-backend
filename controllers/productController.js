const Product = require("../models/Product");

// Создать товар
exports.createProduct = async (req, res) => {
    try {
        const { name, sku, price, quantity, imageUrl } = req.body;
        const existing = await Product.findOne({ sku });
        if (existing) return res.status(400).json({ message: "SKU already exists" });

        const product = new Product({ name, sku, price, quantity, imageUrl });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Получить все товары
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Обновить товар
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const product = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Удалить товар
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
