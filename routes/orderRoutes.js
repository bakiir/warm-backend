const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const auth = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/authMiddleware");

router.use(auth);

// 📥 Создать приход — только admin и manager
router.post("/", checkRole("admin", "manager"), controller.createOrder);

// 📄 Получить список всех приходов
router.get("/", controller.getAllOrders);

module.exports = router;
