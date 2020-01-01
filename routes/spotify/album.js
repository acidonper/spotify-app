const express = require("express");
const router = express.Router();
const axios = require("axios");
const getSpotifyToken = require("../../controller/getSpotifyToken");
require("dotenv").config();

const spotify_api = process.env.SPOTIFY_API;
let spotify_token = process.env.SPOTIFY_TOKEN;

router.get("/", async (req, res) => {
    const { id } = req.query;
    const url = `${spotify_api}albums/${id}/tracks`;
    try {
        if (!spotify_token) {
            spotify_token = await getSpotifyToken();
            process.env["SPOTIFY_TOKEN"] = spotify_token;
        }
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${spotify_token}`,
                "Content-Type": "aplication/json"
            }
        });
        res.status(200).json({ message: response.data });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = router;
