const router = require("express").Router();
const user = require("../controller/user.controller");

router.get("/find/:id", user.findUser);
router.get("/findAll", user.findAllUsers);
router.post("/create", user.createUser);
router.put("/update/:id", user.updateUser);
router.delete("/delete/:id", user.deleteUser);

module.exports = router;