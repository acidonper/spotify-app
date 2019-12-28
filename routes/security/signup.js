const express = require("express");
const router = express.Router();
const checkers = require("../../controller/checkers");
const mongoUser = require("../../controller/mongoUser");

router.post("/", async (req, res) => {
    try {
        checkers.checkHttpParams(req.body);
        const { email } = req.body;
        try {
            await mongoUser.searchUser(email);
        } catch (error) {
            await mongoUser
                .newUser(req.body)
                .then(() => res.redirect("/login"))
                .catch(err => {
                    if (err.name === "ValidationError") {
                        error_data.code = 422;
                        error_data.message = err.message;
                        res.render("error", error_data);
                    } else {
                        error_data.code = 500;
                        error_data.message = err.message;
                        res.render("error", error_data);
                    }
                });
        }
        error_data.code = 409;
        error_data.message = `User ${email} exists`;
        res.render("error", error_data);
    } catch (error) {
        error_data.code = 422;
        error_data.message = error;
        res.render("error", error_data);
    }
});

module.exports = router;
