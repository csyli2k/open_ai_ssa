const mongoose = require("mongoose");

//schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    trailActive: { type: Boolean, default: true },
    trailPeriod: { type: Number, default: 3 },
    trailExpires: { type: Date },
    subscriptionPlan: {
      type: String,
      enum: ["Trail", "Free", "Basic", "Premium"],
      default: "Trail",
    },
    apiRequestCount: { type: Number, default: 0 },
    monthlyRequestCount: { type: Number, default: 100 },
    nextBillingDate: Date,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    ContentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContentHistory",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//add virtula property
// userSchema.virtual("isTrialActive").get(function () {
//   return this.trailActive && new Date() < this.trailExpires;
// });

//! Complite to form the model
const User = mongoose.model("User", userSchema);
module.exports = User;
