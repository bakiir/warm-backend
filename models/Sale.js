const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, enum: ["cash", "card", "online-order"], required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true } // будет браться из базы
        }
    ],
    total: { type: Number, required: true }
});

module.exports = mongoose.model("Sale", saleSchema);
