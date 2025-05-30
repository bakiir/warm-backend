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
        const sales = await Sale.find().populate("soldBy", "name").populate("items.productId", "name");
        res.status(200).json(sales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при получении истории продаж" });
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


