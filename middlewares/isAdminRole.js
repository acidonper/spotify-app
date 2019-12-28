module.exports = (req, res, next) => {
    if (req.session && req.session.currentUser) {
        if (req.session.currentUser.role === "ADMIN_ROLE") next();
        res.status(401).json({ message: "Unauthorized" });
    } else {
        res.status(401).json({ message: "Please login" });
    }
};
