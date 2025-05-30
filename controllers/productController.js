const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinary");


// Создать товар
exports.createProduct = async (req, res) => {
    try {
        const { name, price, sku, quantity, category } = req.body;

        const imageUrl = req.file ? req.file.path : null; // Cloudinary path (публичный)

        const product = new Product({
            name,
            sku,
            price,
            quantity,
            imageUrl,
            category
        });

        await product.save();

        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при создании продукта" });
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

        // Если есть новый файл — загрузить его в Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            });
            updates.imageUrl = result.secure_url;
        }

        const product = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (err) {
        console.error(err);
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
