const express = require("express");
const router = express.Router();
const { createSale, getSales, getDailySummary } = require("../controllers/saleController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, createSale);        // 💰 Совершить продажу
router.get("/", auth, getSales);           // 📜 История продаж
router.get("/summary/daily", auth, getDailySummary);


module.exports = router;
