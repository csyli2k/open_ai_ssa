const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const checkApiReuqestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authrozied" });
  }
  //find the user
  const user = await User.findById(req?.user?.id);
  if (!req.user) {
    return res.status(404).json({ message: "User Not found" });
  }
  let requestLimit = 0;
  //check if the user is on a trial period
  if (user?.trailActive) {
    requestLimit = user?.monthlyRequestCount;
  }
  // check if the user exceed the monthly request
  if (user?.apiRequestCount >= requestLimit) {
    throw new Error("API reuqest limit reached, Please purchase new api plan");
  }
  next();
});

module.exports = checkApiReuqestLimit;
