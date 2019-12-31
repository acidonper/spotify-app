const Express = require("express");
const router = Express.Router();

router.use("/", require("./root"));

router.use("/login", require("./login"));

router.use("/signup", require("./signup"));

router.use("/home", require("./home"));

module.exports = router;