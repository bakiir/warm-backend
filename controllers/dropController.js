const Order = require("../models/Drop");
const Product = require("../models/Product");
const User = require("../models/User");

// Создание нового прихода
exports.createOrder = async (req, res) => {
    try {
        const { supplier, items } = req.body;

        // Проверка существования всех продуктов
        for (const item of items) {
            const productExists = await Product.findById(item.productId);
            if (!productExists) {
                return res.status(400).json({
                    message: `Продукт с ID ${item.productId} не найден`
                });
            }
        }

        // Создание заказа
        const order = new Order({
            supplier,
            items,
            acceptedBy: req.user.id
        });

        await order.save();

        // Получаем username по ID пользователя
        const user = await User.findById(req.user.id).select("username");

        // Конвертируем заказ в обычный объект и подменяем acceptedBy
        const orderObj = order.toObject();
        orderObj.acceptedBy = user.username;

        // Увеличение количества товаров на складе
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { quantity: item.quantity } }
            );
        }
        const enrichedItems = await Promise.all(order.items.map(async (item) => {
            const product = await Product.findById(item.productId).select("sku");
            return {
                sku: product.sku,
                quantity: item.quantity,
            };
        }));

        orderObj.items = enrichedItems

        res.status(201).json(orderObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при создании прихода" });
    }
};

// Получение всех приходов
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const orderObj = order.toObject();

            // Заменяем acceptedBy на username
            const user = await User.findById(orderObj.acceptedBy).select("username");
            orderObj.acceptedBy = user?.username || "Неизвестный пользователь";

            // Заменяем productId на SKU и quantity
            const enrichedItems = await Promise.all(orderObj.items.map(async (item) => {
                const product = await Product.findById(item.productId).select("sku");
                return {
                    sku: product?.sku || "Неизвестен",
                    quantity: item.quantity,
                };
            }));

            orderObj.items = enrichedItems;

            return orderObj;
        }));

        res.json(enrichedOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при получении приходов" });
    }
};
