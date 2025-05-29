const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const auth = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/authMiddleware");

router.use(auth); // все маршруты защищены

router.post("/",checkRole("admin"), controller.createProduct); // создать
router.get("/", controller.getAllProducts); // получить список
router.put("/:id", checkRole("admin"), controller.updateProduct); // обновить
router.delete("/:id",  checkRole("admin"), controller.deleteProduct); // удалить
router.get("/category/:id", controller.getProductsByCatId)

module.exports = router;
