const express = require("express");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();
const usersRouter = require("./routes/UsersRouter");
const connectDB = require("./untils/connectDB");
connectDB();
const { errorHandler } = require("./middlewares/errorMiddleware");
const openAIRouter = require("./routes/openAIRouter");
const stripeRouter = require("./routes/stripeRouter");
const User = require("./models/User");

// require("./untils/connectDB")();
const app = express();

const PORT = process.env.PORT || 8090;

// middlewares

// run every 1s
// cron.schedule("* * * * * *", () => {
//   console.log("runs every second");
// });

//Cron for trail period
cron.schedule("0 0 * * * *", async () => {
  console.log("runs every single hour");
  try {
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        trailActive: true,
        nextBillingDate: { $lt: today },
      },
      {
        trailActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 5,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//Cron for the paid plan Free
cron.schedule("0 0 1 * * *", async () => {
  console.log("runs every month");
  try {
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//Cron for the paid plan Basic
cron.schedule("0 0 1 * * *", async () => {
  console.log("runs every month");
  try {
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//Cron for the paid plan Premium
cron.schedule("0 0 1 * * *", async () => {
  console.log("runs every month");
  try {
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//in a Node.js Express application is middleware that tells the application to use JSON parsing. This means it can automatically parse JSON formatted data sent in the body of HTTP requests. It's essential for handling POST and PUT requests where the data sent by the client is in JSON format, allowing you to access this data via req.body in your route handlers.
app.use(express.json()); //pass incoming json data
app.use(cookieParser()); // pass the cookie automatically
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

//route
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", stripeRouter);

//---Error Handler middleware
app.use(errorHandler);
//start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
