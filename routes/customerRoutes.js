const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerController");
const auth = require("../middlewares/authMiddleware");

router.use(auth); // обычный юзер

router.get("/products", controller.getProducts);
router.post("/orders", controller.createOrder);
router.get("/orders", controller.getMyOrders);

module.exports = router;
