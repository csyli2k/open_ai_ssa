const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  handlestripePayment,
  handFreeSubscription,
  VerifyPayment,
} = require("../controllers/handleStripePayments");

const stripeRouter = express.Router();

stripeRouter.post("/payment", isAuthenticated, handlestripePayment);
stripeRouter.post("/free-plan", isAuthenticated, handFreeSubscription);
stripeRouter.post("/verify-payment/:paymentId", isAuthenticated, VerifyPayment);

module.exports = stripeRouter;
