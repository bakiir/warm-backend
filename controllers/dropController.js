const Order = require("../models/Drop");
const Product = require("../models/Product");

// Создание нового прихода
exports.createOrder = async (req, res) => {
    try {
        const { supplier, items } = req.body;

        // Проверяем все productId
        for (const item of items) {
            const productExists = await Product.findById(item.productId);
            if (!productExists) {
                return res.status(400).json({
                    message: `Продукт с ID ${item.productId} не найден`
                });
            }
        }

        // Создаём заказ
        const order = new Order({
            supplier,
            items,
            acceptedBy: req.user.id
        });

        await order.save();

        // Увеличиваем количество на складе
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { quantity: item.quantity } }
            );
        }

        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при создании прихода" });
    }
};

// Получение всех приходов
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении приходов" });
    }
};
