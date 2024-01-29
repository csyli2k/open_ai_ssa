const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");
const User = require("../models/User");
// isauthenticated
const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    //verify toekn
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    //console.log("decoded!!!!!!!!!:", decoded);

    //add user to the req obj
    req.user = await User.findById(decoded?.id).select("-password");
    console.log(" it is working for authentication");
    return next();
  } else {
    return res.status(401).json({ message: " No token cant access!!!!!" });
  }
});

module.exports = isAuthenticated;
