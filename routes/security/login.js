const express = require("express");
const router = express.Router();
const checkers = require("../../controller/checkers");
const mongoUser = require("../../controller/mongoUser");

router.post("/", async (req, res) => {
    const data = { message: "", code: "", navbar: true };
    try {
        checkers.checkHttpLoginParams(req.body);
        const { email, password } = req.body;
        try {
            await mongoUser.searchUser(email);
            await mongoUser.checkUserPasswd(email, password);
            req.session.currentUser = email;
            res.redirect("/home");
        } catch (error) {
            data.code = 400;
            data.message = error;
            res.render("error", data);
        }
    } catch (error) {
        data.code = 422;
        data.message = error;
        res.render("error", data);
    }
});

module.exports = router;
