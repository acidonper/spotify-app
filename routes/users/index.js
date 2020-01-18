const Express = require("express");
const router = Express.Router();

router.use("/searchsongs", require("./searchFavoriteSongs"));
router.use("/addsong", require("./addFavoriteSong"));
router.use("/deletesong", require("./deleteFavoriteSong"));

module.exports = router;
