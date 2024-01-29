const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const calculateNextBillingDate = require("../untils/calculateNextBillingDate");
const {
  shouldRenewSubscriptionPlan,
} = require("../untils/shouldRenewSubscriptionPlan");
const Payment = require("../models/Payment");
const User = require("../models/User");

//-----Stripe payment-----
const handlestripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  //get the user
  const user = req?.user;

  try {
    //Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "usd",
      //add some data the meta object
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });

    //send request
    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//-----Verify payment-----
const VerifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    if (paymentIntent.status === "succeeded") {
      //get info metada
      const metadata = paymentIntent.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      // find user
      const userFound = await User.findById(userId);
      if (!userFound) {
        return res.status(404).json({
          status: "false",
          message: "user not found",
        });
      }

      // get payment details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;

      //create the payment history
      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });

      //check for the subscription plan
      if (subscriptionPlan === "Basic") {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 50,
          subscriptionPlan: "Basic",
          $addToSet: { payments: newPayment?._id },
        });

        res.json({
          status: true,
          message: "Payment verified, user updated",
          updatedUser,
        });
      }

      if (subscriptionPlan === "Premium") {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 100,
          subscriptionPlan: "Premium",
          $addToSet: { payments: newPayment?._id },
        });

        res.json({
          status: true,
          message: "Payment verified, user updated",
          updatedUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});
//handle free subscription
const handFreeSubscription = asyncHandler(async (req, res) => {
  //GET LOG IN USER
  const user = req?.user;
  // check if account should be renew or not
  try {
    if (shouldRenewSubscriptionPlan(user)) {
      // update user account
      user.subscriptionPlan = "Free";
      user.monthlyRequestCount = 5;
      user.apiRequestCount = 0;
      // calculate next billing data
      user.nextBillingDate = calculateNextBillingDate();

      // create new payment and save into DB
      const newpayment = await Payment.create({
        user: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "success",
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 5,
        currency: "usd",
      });
      user.payments.push(newpayment?._id);

      await user.save();
      //send response
      return res.json({
        status: "success",
        message: " subscription plan updated ",
        user,
      });
    } else {
      return res.status(403).json({ error: "not due yet" });
    }
  } catch (error) {}
});

module.exports = { handlestripePayment, handFreeSubscription, VerifyPayment };
