const Express = require("express");
const router = Express.Router();

router.use("/newreleases", require("./newreleases"));
router.use("/album", require("./album"));

module.exports = router;
