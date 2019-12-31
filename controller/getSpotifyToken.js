const request = require("request");
require("dotenv").config();

let client_id = process.env.SPOTIFY_ID;
let client_secret = process.env.SPOTIFY_SECRET;

module.exports = () => {
    return new Promise((resolve, reject) => {
        let spotifyUrl = "https://accounts.spotify.com/api/token";
        var authOptions = {
            url: spotifyUrl,
            headers: {
                Authorization:
                    "Basic " +
                    new Buffer(client_id + ":" + client_secret).toString(
                        "base64"
                    )
            },
            form: {
                grant_type: "client_credentials"
            },
            json: true
        };
        request.post(authOptions, (err, httpResponse, body) => {
            if (err) {
                reject({
                    ok: false,
                    mensaje: "No se pudo obtener el token",
                    err
                });
            }
            resolve(body.access_token);
        });
    });
};
