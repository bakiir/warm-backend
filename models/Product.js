const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    imageUrl: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
