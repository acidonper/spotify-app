const Express = require("express");
const router = Express.Router();

router.use("/login", require("./login"));
router.use("/signup", require("./signup"));
router.use("/logout", require("./logout"));

module.exports = router;
