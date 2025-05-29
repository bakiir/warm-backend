const Product = require("../models/Product");
const Order = require("../models/Order");

// GET /picker/orders/pending
exports.getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: "pending" }).populate("items.product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
// POST /picker/orders/:id/accept
exports.acceptOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.status !== "pending") {
            return res.status(400).json({ message: "Order not available" });
        }

        order.status = "in_progress";
        order.assignedTo = req.user.id;
        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
// POST /picker/orders/:id/complete
exports.completeOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.product");

        if (!order || order.status !== "in_progress" || String(order.assignedTo) !== req.user.id) {
            return res.status(400).json({ message: "Access denied or wrong status" });
        }

        for (const item of order.items) {
            const product = await Product.findById(item.product._id);
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Недостаточно товара: ${product.name}` });
            }
            product.quantity -= item.quantity;
            await product.save();
        }

        order.status = "ready";
        await order.save();

        res.json({ message: "Order completed", order });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
