const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../middlewares/isLoggedIn");

router.get("/", isLoggedIn, (req, res) => {
    const data = { user: req.session.currentUser };
    res.render("home", data);
});

module.exports = router;
