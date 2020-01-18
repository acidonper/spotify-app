module.exports = (req, res, next) => {
    if (req.session.currentUser) return next();
    const error_data = { message: "", code: "", navbar: true };
    error_data.code = 400;
    error_data.message = "Please login";
    res.render("error", error_data);
};
