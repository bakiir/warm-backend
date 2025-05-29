const Product = require("../models/Product");
const Order = require("../models/Order");


// GET /customer/products?category=Молочка
exports.getProducts = async (req, res) => {
    const { category } = req.query;
    try {
        const filter = category ? { category } : {};
        const products = await Product.find(filter);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
// POST /customer/orders
exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: user info missing" });
        }

        const order = new Order({
            user: req.user.id,
            items,
            status: "pending"
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error("Ошибка при создании заказа:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /customer/orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("items.product").sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
