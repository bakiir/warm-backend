const Product = require("../models/Product");
const Category = require("../models/Category");

// Создать товар
exports.createProduct = async (req, res) => {
    try {
        const { name, sku, price, quantity, imageUrl, category } = req.body;

        // Check for existing product by SKU
        const existing = await Product.findOne({ sku });
        if (existing) return res.status(400).json({ message: "SKU already exists" });

        // Check if category exists
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) return res.status(400).json({ message: "Category not found" });

        // Create product
        const product = new Product({ name, sku, price, quantity, category, imageUrl });
        await product.save();

        // Attach category name manually (if needed)
        const productObj = product.toObject();
        productObj.categoryName = categoryDoc.name;

        res.status(201).json(productObj);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Получить все товары
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name") // ✅ подтянем имя категории
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getProductsByCatId = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const products = await Product.find({ category: categoryId }).populate("category");
        res.json(products);
    } catch (err) {
        console.error(err);
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
