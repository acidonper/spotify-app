const userModel = require("../models/user");
const songModel = require("../models/song");
const bcrypt = require("bcrypt");

const newUser = async newUser => {
    try {
        const { password } = newUser;

        // Encrypt password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        newUser.password = hashPass;

        // Create user
        const user = new userModel(newUser, { autoIndex: false });
        await user.save();
    } catch (error) {
        throw error;
    }
};

const searchUser = async searchByEmail => {
    try {
        const userSearched = userModel.find({ email: searchByEmail });
        const findAction = await userSearched.exec();
        if (findAction.length === 0) throw `User ${searchByEmail} not found`;
        if (findAction.length > 1) throw `User ${searchByEmail} duplicated`;
        return findAction[0];
    } catch (error) {
        throw error;
    }
};

const checkUserPasswd = async (email, userpasswd) => {
    try {
        const userSearched = userModel.find({ email: email });
        const findAction = await userSearched.exec();
        if (findAction.length === 0) throw `User ${searchByUsername} not found`;
        const passwordDB = findAction[0].password;
        if (!bcrypt.compareSync(userpasswd, passwordDB))
            throw `Invalid Password`;
    } catch (error) {
        throw error;
    }
};

const searchFavoriteSongs = async searchSongsByEmail => {
    try {
        const userSearched = userModel
            .find({ email: searchSongsByEmail })
            .populate({
                path: "favoriteSongs",
                model: "SpotifySong",
                select: "spotify_id name album"
            });
        const findAction = await userSearched.exec();
        if (findAction.length === 0)
            throw `User ${searchSongsByEmail} not found`;
        if (findAction.length > 1)
            throw `User ${searchSongsByEmail} duplicated`;
        const songs = findAction[0].favoriteSongs;
        return songs;
    } catch (error) {
        throw error;
    }
};

const addFavoriteSong = async (userEmail, songID) => {
    try {
        const addSong = await userModel
            .findOneAndUpdate(
                { email: userEmail },
                { $addToSet: { favoriteSongs: songID } },
                { new: true }
            )
            .populate({
                path: "favoriteSongs",
                model: "SpotifySong",
                select: "name"
            });
        return `Added favorite song ${songID} to ${userEmail}`;
    } catch (error) {
        throw error;
    }
};

const deleteFavoriteSong = async (userEmail, songID) => {
    try {
        const deleteSong = userModel
            .findOneAndUpdate(
                { email: userEmail },
                { $pull: { favoriteSongs: songID } },
                { new: true }
            )
            .populate({
                path: "favoriteSongs",
                model: "SpotifySong",
                select: "name"
            });
        await deleteSong.exec();
        return `Deleted favorite song ${songID} from ${userEmail}`;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    newUser,
    searchUser,
    checkUserPasswd,
    searchFavoriteSongs,
    addFavoriteSong,
    deleteFavoriteSong
};
