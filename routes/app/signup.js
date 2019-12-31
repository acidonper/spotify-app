const Express = require("express");
const router = Express.Router();

router.get("/", async (req, res) => {
    const data = { navbar: false };
    res.render("signup", data);
});

module.exports = router;
