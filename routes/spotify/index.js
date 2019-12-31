const Express = require("express");
const router = Express.Router();

router.use("/newreleases", require("./newreleases"));

module.exports = router;
