const express = require("express");
const router = express.Router();
const isAdminRole = require("../../middlewares/isAdminRole");

router.get("/", isAdminRole, (req, res) => {
    res.status(200).json({ message: "OK ADMIN!" });
});

module.exports = router;
