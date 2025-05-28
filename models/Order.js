const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    supplier: { type: String, required: true },
    date: { type: Date, default: Date.now },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true }
        }
    ],
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // 🔥 кто принял поставку
});

module.exports = mongoose.model("Order", orderSchema);
