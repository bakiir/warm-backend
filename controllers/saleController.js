const Product = require("../models/Product");
const Sale = require("../models/Sale");
const User = require("../models/User");

exports.createSale = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;
        if (!["cash", "card", "online-order"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Неверный способ оплаты" });
        }

        let total = 0;
        const saleItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: "Товар не найден" });

            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Недостаточно на складе: ${product.name}` });
            }

            await Product.findByIdAndUpdate(item.productId, {
                $inc: { quantity: -item.quantity }
            });

            saleItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });

            total += product.price * item.quantity;
        }

        const sale = new Sale({
            soldBy: req.user.id,
            paymentMethod,
            items: saleItems,
            total
        });

        await sale.save();

        // Получаем username
        const user = await User.findById(req.user.id).select("username");

        // Заменяем productId на sku
        const enrichedItems = await Promise.all(sale.items.map(async (item) => {
            const product = await Product.findById(item.productId).select("sku");
            return {
                sku: product.sku,
                quantity: item.quantity,
                price: item.price
            };
        }));

        // Отправляем клиенту ответ с username и sku
        res.status(201).json({
            soldBy: user.username,
            paymentMethod: sale.paymentMethod,
            items: enrichedItems,
            total: sale.total,
            date: sale.date
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при продаже" });
    }
};

exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate("soldBy", "username")
            .populate("items.productId", "name")
            .lean();

        const formatted = sales.map(sale => ({
            _id: sale._id,
            soldBy: sale.soldBy?.username || "Неизвестно",
            paymentMethod: sale.paymentMethod,
            items: sale.items.map(item => ({
                productId: item.productId ? {
                    _id: item.productId._id,
                    name: item.productId.name
                } : null,
                quantity: item.quantity,
                price: item.price
            })),
            total: sale.total,
            date: sale.date
        }));

        res.json(formatted);
    } catch (err) {
        console.error("Ошибка при получении продаж:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

exports.getDailySummary = async (req, res) => {
    try {
        const summary = await Sale.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalSales: { $sum: "$total" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        res.status(200).json(summary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при получении сводки" });
    }
};


