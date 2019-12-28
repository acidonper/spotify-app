module.exports = (req, res, next) => {
    if (req.session.currentUser) next();
    const error_data = { message: "", code: "" };
    error_data.code = 400;
    error_data.message = "Please login";
    res.render("error", error_data);
};
