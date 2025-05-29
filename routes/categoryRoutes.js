const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");
const auth = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/authMiddleware");

router.use(auth); // все защищены

router.post("/", checkRole("admin"), controller.createCategory); // ✅ создать
router.get("/", controller.getCategories); // всем доступен
router.delete("/:id", checkRole("admin"), controller.deleteCategory); // ✅ удалить

module.exports = router;
