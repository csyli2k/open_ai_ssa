const User = require("../models/User");
const bcrypt = require("bcryptjs");
const anyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Registation
const register = anyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //validate
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  // check the email is if it exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash the user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create the user

  const newUser = new User({ username, password: hashedPassword, email });

  // add the date trail will end
  newUser.trailExpires = new Date(
    new Date().getTime() + newUser.trailPeriod * 24 * 60 * 60 * 1000
  );

  //save the user
  await newUser.save();

  res.json({
    status: true,
    message: "Registration was successfull",
    user: {
      username,
      email,
    },
  });
});
// Login
const login = anyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if email exist
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  //check if password is correct
  // user && user.Password is same as user?.hashedPassword
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  // generate Token(jwt)
  // two ways: 1. server generate token and send it to client and store at client side,  advantage: it works for mobile app ， disadvantage: user has to send the token with every request
  //   we use this one        2. save the toke inside the cookie of user browser advantage: dont have to manually send the token for every request (server will do it)
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  }); // token expires in 3days};

  // set the token into cookies (http only)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1day in millseconds
  });

  // send the reqsponse
  res.json({
    status: "success",
    id: user?.id,
    message: "login success",
    username: user?.username,
    email: user?.email,
  });
});

// LogOut

const logout = anyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "logged out from website" });
});
// Profile
const userProfile = anyncHandler(async (req, res) => {
  const id = await User.findById(req?.user?.id);
  const user = await User.findById(id)
    .select("-password")
    .populate("payments")
    .populate("ContentHistory");
  if (user) {
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not find");
  }
});
// CHeck user AUth Status
const checkAuth = anyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if (decoded) {
    res.json({
      isAuthenticated: true,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});

module.exports = {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
};
