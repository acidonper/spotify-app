const express = require("express");
const router = express.Router();
const axios = require("axios");

const SERVER_PORT = process.env.SERVER_PORT || 5000;

// const isLoggedIn = require("../../middlewares/isLoggedIn");
// router.get("/", isLoggedIn, async (req, res) => {
router.get("/", async (req, res) => {
    // const data = {
    //     navbar: true,
    //     user: req.session.currentUser,
    //     logged: true
    // };
    // res.render("welcome", data);
    try {
        if (!req.session.currentUser) {
            const data = { message: "", code: "", navbar: true };
            data.code = 400;
            data.message = "Please login";
            res.render("error", data);
        }
        let data = {
            navbar: true,
            user: req.session.currentUser,
            logged: true
        };
        const spotifyData = await axios.get(
            `http://localhost:${SERVER_PORT}/spotify/newreleases`
        );
        data.spotify = spotifyData.data.message.albums.items;
        res.render("welcome", data);
    } catch (error) {
        const data = { message: "", code: "", navbar: true };
        data.code = 500;
        data.message = error;
        res.render("error", data);
    }
});

module.exports = router;
