const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("error_msg", "You must log in first");
    return res.redirect("/user/login");
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token");
    req.flash("error_msg", "Session expired. Please log in again.");
    return res.redirect("/user/login");
  }
};

module.exports = verifyToken;
