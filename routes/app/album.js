const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoUser = require("../../controller/mongoUser");
const { newSong } = require("../../controller/mongoSong");
const SERVER_PORT = process.env.SERVER_PORT || 5000;
const isLoggedIn = require("../../middlewares/isLoggedIn");

router.get("/", isLoggedIn, async (req, res) => {
    try {
        const { id, album } = req.query;
        const spotifyData = await axios.get(
            `http://localhost:${SERVER_PORT}/spotify/album`,
            { params: { id: id } }
        );
        let data = {
            navbar: true,
            user: req.session.currentUser,
            logged: true
        };
        const favoriteSongs = await mongoUser.searchFavoriteSongs(
            req.session.currentUser
        );
        let favoriteSongsSpotifyIds = [];
        favoriteSongs.map(song =>
            favoriteSongsSpotifyIds.push(song.spotify_id)
        );
        const songs = spotifyData.data.message.items;
        songs.map(song => {
            const { id } = song;
            if (favoriteSongsSpotifyIds.includes(id)) song.favorite = true;
        });
        data.spotify = spotifyData.data.message.items;
        data.spotify_album = album;
        res.render("album", data);
    } catch (error) {
        const data = { message: "", code: "", navbar: true };
        data.code = 500;
        data.message = error;
        res.render("error", data);
    }
});

module.exports = router;
