const Express = require("express");
const router = Express.Router();

router.get("/", async (req, res) => {
    const data = { navbar: false };
    res.render("login", data);
});

module.exports = router;
