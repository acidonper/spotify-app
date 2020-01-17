const Express = require("express");
const router = Express.Router();
const mongoUser = require("../../controller/mongoUser");
const isLoggedIn = require("../../middlewares/isLoggedIn");

router.post("/", isLoggedIn, async (req, res) => {
    const data = { message: "", code: "", navbar: true };
    try {
        await mongoUser.deleteFavoriteSong(req.session.currentUser, song);
        const favoritesongs = await mongoUser.searchFavoriteSongs(
            req.session.currentUser
        );
        res.status(200).json({ message: favoritesongs });
    } catch (error) {
        data.code = 422;
        data.message = error;
        res.render("error", data);
    }
});

module.exports = router;
