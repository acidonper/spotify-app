const Express = require("express");
const router = Express.Router();
const mongoUser = require("../../controller/mongoUser");
const { searchSong } = require("../../controller/mongoSong");
const checkers = require("../../controller/checkers");

const isLoggedIn = require("../../middlewares/isLoggedIn");

router.post("/", isLoggedIn, async (req, res) => {
    const data = { message: "", code: "", navbar: true };
    try {
        const { spotify_id, name, album } = req.body;
        const songID = await searchSong(spotify_id, name, album);
        const deleteSong = await mongoUser.deleteFavoriteSong(
            req.session.currentUser,
            songID
        );
        res.status(200).json({ message: deleteSong });
    } catch (error) {
        data.code = 422;
        data.message = error;
        res.render("error", data);
    }
});

module.exports = router;
