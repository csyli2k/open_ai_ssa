const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const openAIController = require("../controllers/openAIController");
const checkApiReuqestLimit = require("../middlewares/checkApiRequestLimit");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiReuqestLimit,
  openAIController
);

module.exports = openAIRouter;
