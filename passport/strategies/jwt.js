const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../../models/user");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log(`Strategy JWT: token ${tokenPayload}`);
    try {
        const user = await User.findOne({ _id: jwt_payload.sub });
        console.log(user);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: "invalid token" });
        }
    } catch (error) {
        done(error);
    }
});
