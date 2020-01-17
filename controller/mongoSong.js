const songModel = require("../models/song");

const searchSong = async (spotify_id, name, album) => {
    try {
        const searchedSong = {
            spotify_id: spotify_id,
            name: name,
            album: album
        };
        const songSearched = songModel.find(searchedSong);
        const findAction = await songSearched.exec();
        if (findAction.length === 0) throw `Song ${searchedSong} not found`;
        return findAction[0]._id;
    } catch (error) {
        throw error;
    }
};

const newSong = async (spotify_id, name, album) => {
    try {
        const newSong = {
            spotify_id: spotify_id,
            name: name,
            album: album
        };
        const songSearched = songModel.find(newSong);
        const findAction = await songSearched.exec();
        if (findAction.length === 0) {
            const song = new songModel(newSong, { autoIndex: false });
            await song.save();
            return song._id;
        } else {
            return findAction[0]._id;
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    newSong,
    searchSong
};
