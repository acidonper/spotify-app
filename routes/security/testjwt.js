const express = require("express");
const router = express.Router();
const isAutenticated = require("../../middlewares/isAuthenticated");

router.get("/", isAutenticated, (req, res, next) => {
    console.log("venga");
    res.json({ message: "Autorizado" });
});

module.exports = router;
