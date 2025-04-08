const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, 
    sameSite: "Strict",
  });

  res.redirect("/"); 
};

module.exports = logout;
