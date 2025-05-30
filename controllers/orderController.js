const Product = require("../models/Product");
const Order = require("../models/Order");
const Sale = require("../models/Sale")

// GET /picker/orders/pending
exports.getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: "pending" }).populate("items.product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllOrders = async (req, res) => {

    const { status } = req.query;

    const filter = status ? { status } : {};

    try {
        const orders = await Order.find(filter);
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

        let total = 0;
        const saleItems = [];

        for (const item of order.items) {
            const product = item.product;

            if (!product) {
                return res.status(400).json({ message: "Продукт не найден" });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Недостаточно товара: ${product.name}` });
            }

            product.quantity -= item.quantity;
            await product.save();

            total += product.price * item.quantity;

            saleItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });

        }

        order.status = "ready";
        await order.save();

        const sale = new Sale({
            soldBy: req.user.id,
            paymentMethod: "online-order",
            items: saleItems,
            total
        });

        await sale.save();

        res.json({ message: "Order completed", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
