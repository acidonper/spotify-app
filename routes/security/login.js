const express = require("express");
const router = express.Router();
const checkers = require("../../controller/checkers");
const mongoUser = require("../../controller/mongoUser");

router.post("/", async (req, res) => {
    const error_data = { message: "", code: "" };
    try {
        checkers.checkHttpLoginParams(req.body);
        const { email, password } = req.body;
        try {
            const user = await mongoUser.searchUser(email);
            await mongoUser.checkUserPasswd(email, password);
            req.session.currentUser = email;
            res.redirect("/home");
        } catch (error) {
            error_data.code = 400;
            error_data.message = error;
            res.render("error", error_data);
        }
    } catch (error) {
        error_data.code = 422;
        error_data.message = error;
        res.render("error", error_data);
    }
});

module.exports = router;
