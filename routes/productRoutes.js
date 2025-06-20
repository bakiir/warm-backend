const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const auth = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/authMiddleware");
const multer = require("multer")
const {storage} = require("../config/cloudinary")
const upload = multer({ storage });


router.use(auth); // все маршруты защищены

router.post("/",checkRole("admin"),upload.single('image'), controller.createProduct); // создать
router.get("/", controller.getAllProducts); // получить список
router.put("/:id", checkRole("admin"), upload.single('image'), controller.updateProduct);
router.delete("/:id",  checkRole("admin"), controller.deleteProduct); // удалить
router.get("/category/:id", controller.getProductsByCatId)

module.exports = router;
