import axios from "axios";

// chatgpt

export const generateContentAPI = async (value) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/openai/generate-content",
    {
      prompt: value.prompt,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
