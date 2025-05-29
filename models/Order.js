const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: String,
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true }
        }
    ],
    status: {
        type: String,
        enum: ["pending", "in_progress", "ready"],
        default: "pending"
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // кто сделал заказ

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // сборщик
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
