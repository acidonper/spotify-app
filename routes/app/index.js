const Express = require("express");
const router = Express.Router();

router.get("/", async (req, res) => {
    res.render("welcome");
});

router.get("/login", async (req, res) => {
    res.render("login");
});

router.get("/signup", async (req, res) => {
    res.render("signup");
});

router.use("/home", require("./home"));

router.use("/admin", require("./admin"));

module.exports = router;
