const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.set("debug", true);
    const conn = await mongoose.connect(
      "mongodb+srv://csyli3506:GRGGql95ORN2wn3g@cluster0.r8uasxa.mongodb.net/mern-open-ai?retryWrites=true&w=majority"
    );
    console.log(`Mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.error(
      `error connecting to Mongodb this is weird: ${error.message}`
    );
    process.exit(1);
  }
};

module.exports = connectDB;
