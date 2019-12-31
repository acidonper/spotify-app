const Express = require("express");
const router = Express.Router();
const isLoggedIn = require("../../middlewares/isLoggedIn");

router.get("/", async (req, res) => {
    if (!req.session.currentUser) {
        const data = { navbar: true, logged: false };
        res.render("welcome", data);
    } else {
        res.redirect("/home");
    }
});

module.exports = router;
