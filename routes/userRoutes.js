const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authMiddleware")
const {checkRole} = require("../middlewares/authMiddleware")
const controller = require("../controllers/userController")

router.use(auth)
router.use(checkRole("admin"))

router.get("/", controller.getAllUsers)
router.put("/:id", controller.updateUser)

module.exports = router