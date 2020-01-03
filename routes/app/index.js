const Express = require("express");
const router = Express.Router();

router.use("/", require("./root"));

router.use("/login", require("./login"));

router.use("/signup", require("./signup"));

router.use("/home", require("./home"));

router.use("/album", require("./album"));

router.use("/health", require("./health"));

module.exports = router;
