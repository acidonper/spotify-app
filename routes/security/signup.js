const express = require("express");
const router = express.Router();
const checkers = require("../../controller/checkers");
const mongoUser = require("../../controller/mongoUser");

router.post("/", async (req, res) => {
    const data = { message: "", code: "", navbar: true };
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
                        data.code = 422;
                        data.message = err.message;
                        res.render("error", data);
                    } else {
                        data.code = 500;
                        data.message = err.message;
                        res.render("error", data);
                    }
                });
            data.code = 500;
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
