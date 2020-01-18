const Express = require("express");
const router = Express.Router();
const mongoUser = require("../../controller/mongoUser");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const { newSong } = require("../../controller/mongoSong");

router.post("/", isLoggedIn, async (req, res) => {
    const data = { message: "", code: "", navbar: true };
    try {
        const { spotify_id, name, album } = req.body;
        const newSongID = await newSong(spotify_id, name, album);
        const addSong = await mongoUser.addFavoriteSong(
            req.session.currentUser,
            newSongID
        );
        res.status(200).json({ message: addSong });
    } catch (error) {
        data.code = 422;
        data.message = error;
        res.render("error", data);
    }
});

module.exports = router;
