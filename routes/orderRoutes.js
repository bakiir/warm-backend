const express = require("express");
const router = express.Router();
const picker = require("../controllers/orderController");
const auth = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/authMiddleware");

router.use(auth);
router.use(checkRole("picker")); // доступен только сборщику

router.get("/orders/pending", picker.getPendingOrders);
router.post("/orders/:id/accept", picker.acceptOrder);
router.post("/orders/:id/complete", picker.completeOrder);
router.get("/orders/", picker.getAllOrders)

module.exports = router;
