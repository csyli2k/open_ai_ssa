const asyncHandler = require("express-async-handler");
const axios = require("axios");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

// openAI Controller
const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const content = response?.data?.choices[0].text?.trim();

    //create content history
    const newContent = await ContentHistory.create({
      user: req?.user?.id,
      content,
    });

    //push the content into the user
    const userFound = await User.findById(req?.user?.id);
    userFound.ContentHistory.push(newContent?.id);
    // update the api request count
    userFound.apiRequestCount += 1;
    await userFound.save();

    //send response
    res.status(200).json(newContent);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = openAIController;
